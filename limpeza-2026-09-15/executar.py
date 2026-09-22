import importlib.util
import json
import os
import shutil
import stat
import subprocess
import sys
import time
from pathlib import Path

HOME = Path.home()
ROOT = Path('/Users/ppvfx/Documents/IA')
OUT = Path(__file__).resolve().parent
MAINT = HOME / 'automacoes/codex-fluxo/maintenance'
APPLY = '--apply' in sys.argv
now = time.time()
report = {'mode': 'apply' if APPLY else 'preview', 'removed': [], 'archived': [], 'protected': [], 'errors': []}
before = shutil.disk_usage(HOME).free
processes = subprocess.run(['ps', '-axo', 'comm='], capture_output=True, text=True, check=True).stdout.lower()
open_result = subprocess.run(['/usr/sbin/lsof', '-nP', '-Fn', '-u', str(os.getuid())], capture_output=True, text=True)
open_files = {s[1:] for s in open_result.stdout.splitlines() if s.startswith('n/')}
targets = []

def add(path, days=1):
    path = Path(path)
    if path.is_dir() and not path.is_symlink():
        targets.append((path, now - days * 86400))

for base in [HOME/'Library/Caches', HOME/'Library/Logs', HOME/'Library/Application Support/Caches']:
    if base.exists():
        for child in base.iterdir():
            lower = child.name.lower()
            if any(s in lower for s in ['antigravity', 'figma', 'codex', 'cloudkit', 'nsurlsession', 'playwright', 'puppeteer']):
                report['protected'].append(str(child))
            else:
                add(child)

for name in ['DARWIN_USER_CACHE_DIR', 'DARWIN_USER_TEMP_DIR']:
    result = subprocess.run(['getconf', name], capture_output=True, text=True, check=True)
    add(result.stdout.strip(), 3)
add(HOME/'.npm/_cacache')
for name in ['gdown', 'mamba', 'yt-dlp', 'dvisvgm']:
    add(HOME/'.cache'/name)

support = HOME/'Library/Application Support'
cache_names = ['Cache', 'Code Cache', 'GPUCache', 'DawnWebGPUCache', 'DawnGraphiteCache', 'CachedData', 'Crashpad']
for app, tokens in [('Claude', ['claude.app']), ('Notion', ['notion.app']), ('Antigravity IDE', ['antigravity']), ('Figma', ['figma'])]:
    if any(t in processes for t in tokens):
        report['protected'].append(str(support/app) + ' (processo ativo)')
        continue
    profiles = [support/app]
    if app == 'Figma':
        profiles = list((support/app/'DesktopProfile').glob('v*'))
    for profile in profiles:
        for name in cache_names:
            add(profile/name)
if not any(t in processes for t in ['premiere pro', 'after effects', 'media encoder']):
    for name in ['Media Cache Files', 'Analyzer Cache Files', 'Peak Files', 'Metadata Cache', 'Media Cache']:
        add(support/'Adobe/Common'/name)
if not any(t in processes for t in ['google chrome', 'chrome-devtools', 'chromium']):
    for name in cache_names + ['component_crx_cache', 'GraphiteDawnCache']:
        add(support/'Google/Chrome'/name)
        add(support/'Google/Chrome/Default'/name)

for relative in ['ciclo-anim/node_modules/.cache', 'ciclo-anim/.next/cache', 'agenda-privada/.next/cache']:
    add(ROOT/relative, 3)
for base in [ROOT, HOME/'automacoes/codex-fluxo/ai_news_bot']:
    for current, dirs, files in os.walk(base, followlinks=False):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '.venv', 'recuperacao'} and not (Path(current)/d).is_symlink()]
        if Path(current).name == '__pycache__':
            add(current, 3)
            dirs[:] = []

seen = set()
candidates = []
def safe_directory(p):
    try:
        return not p.is_symlink()
    except OSError as e:
        report['errors'].append(str(e))
        return False

for target, cutoff in targets:
    for current, dirs, files in os.walk(target, followlinks=False, onerror=lambda e: report['errors'].append(str(e))):
        dirs[:] = [d for d in dirs if safe_directory(Path(current)/d) and not any(t in d.lower() for t in ['codex', 'antigravity', 'figma', 'chrome', 'playwright', 'puppeteer', 'recover', 'autosave', 'fileprovider', 'cloudkit', 'icloud', 'nsurlsession', 'photolibrary', 'cloudd'])]
        for name in files:
            p = Path(current)/name
            if str(p) in seen:
                continue
            seen.add(str(p))
            try:
                s = p.lstat()
                if not stat.S_ISREG(s.st_mode) or s.st_mtime >= cutoff or str(p) in open_files:
                    continue
                candidates.append((p, s))
            except OSError as e:
                report['errors'].append(str(e))

for p, s in candidates:
    try:
        if APPLY:
            latest = p.lstat()
            if (latest.st_ino, latest.st_mtime_ns, latest.st_size) != (s.st_ino, s.st_mtime_ns, s.st_size):
                continue
            p.unlink()
        report['removed'].append({'path': str(p), 'bytes': s.st_size, 'allocated_bytes': s.st_blocks * 512})
    except OSError as e:
        report['errors'].append(str(e))

# Generated news outputs are recoverable; Downloads and personal documents stay in place.
news = ROOT/'ciclo-anim/out/news'
cutoff_date = time.strftime('%Y-%m-%d', time.localtime(now - 3 * 86400))
if news.exists():
    for p in sorted(news.iterdir()):
        if len(p.name) != 10 or p.name >= cutoff_date or p.is_symlink():
            continue
        try:
            time.strptime(p.name, '%Y-%m-%d')
        except ValueError:
            continue
        dest = OUT/'recuperacao/noticias'/p.name
        if APPLY:
            dest.parent.mkdir(parents=True, exist_ok=True)
            if dest.exists():
                report['errors'].append('Destino ja existe: ' + str(dest))
                continue
            shutil.move(str(p), str(dest))
        report['archived'].append({'source': str(p), 'destination': str(dest)})

report['files'] = len(report['removed'])
report['logical_bytes'] = sum(x['bytes'] for x in report['removed'])
report['allocated_bytes'] = sum(x['allocated_bytes'] for x in report['removed'])
report['free_before'] = before
report['free_after'] = shutil.disk_usage(HOME).free
report['verified_absent'] = sum(not Path(x['path']).exists() for x in report['removed']) if APPLY else 0
report['open_files_detected'] = len(open_files)
(OUT/('resultado.json' if APPLY else 'previa.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ['removed']}, ensure_ascii=False, indent=2))
