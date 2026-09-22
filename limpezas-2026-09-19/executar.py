import importlib.util
import json
import os
import plistlib
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

HOME = Path.home()
ROOT = Path('/Users/ppvfx/Documents/IA')
OUT = Path(__file__).parent
NOW = time.time()
MODE = '--execute' in sys.argv
warnings = []
skipped = []
selected = []
processes = subprocess.check_output(['ps', '-axo', 'comm='], text=True).lower()
active_ids = set()
for line in processes.splitlines():
    if '.app/' not in line:
        continue
    app = line.split('.app/')[0] + '.app'
    try:
        with open(Path(app) / 'Contents/Info.plist', 'rb') as f:
            info = plistlib.load(f)
        active_ids.add(str(info.get('CFBundleIdentifier', '')).lower())
    except Exception:
        pass

app_patterns = {
    'adobe': ['adobe', 'premiere', 'after effects', 'coresync'],
    'figma': ['figma'],
    'antigravity': ['antigravity'],
    'chrome': ['google chrome'],
    'claude': ['claude'],
    'codex': ['codex'],
    'safari': ['safari'],
    'notion': ['notion'],
    'puppeteer': ['chrome-headless-shell', 'puppeteer'],
}

def active(path):
    value = str(path).lower()
    if any(identifier and identifier in value for identifier in active_ids):
        return True
    return any(key in value and any(p in processes for p in patterns)
               for key, patterns in app_patterns.items())

def examine(path):
    """Count allocated bytes and newest modification; never follow symlinks."""
    total = 0
    newest = 0
    paths = [path]
    if path.is_dir() and not path.is_symlink():
        for base, dirs, files in os.walk(path, followlinks=False, onerror=lambda e: (_ for _ in ()).throw(e)):
            paths.extend(Path(base) / n for n in dirs + files)
    for p in paths:
        stat = p.lstat()
        total += stat.st_blocks * 512
        newest = max(newest, stat.st_mtime)
    return total, newest

def candidate(path, category, min_days=1):
    path = Path(path)
    if not path.exists() or path.is_symlink():
        return
    if active(path):
        skipped.append({'path': str(path), 'reason': 'aplicativo em uso'})
        return
    try:
        size, newest = examine(path)
        if newest > NOW - min_days * 86400:
            skipped.append({'path': str(path), 'reason': 'conteudo recente'})
            return
        selected.append({'path': str(path), 'category': category, 'bytes': size, 'min_days': min_days})
    except OSError as exc:
        warnings.append(str(exc))

def children(path, category, days=1):
    try:
        if path.is_dir():
            for item in path.iterdir():
                candidate(item, category, days)
    except OSError as exc:
        warnings.append(str(exc))

# Regenerable cache roots used by the daily and 48-hour routines.
children(HOME / 'Library/Caches', 'caches do usuario')
for name in ['pip', 'node-gyp', 'electron']:
    candidate(HOME / 'Library/Caches' / name, 'cache de downloads de dependencias', 0)
children(HOME / 'Library/Application Support/Caches', 'caches do usuario')
for name, category in [('DARWIN_USER_CACHE_DIR', 'caches temporarios'), ('DARWIN_USER_TEMP_DIR', 'temporarios antigos')]:
    value = subprocess.check_output(['getconf', name], text=True).strip()
    if value:
        children(Path(value), category)
# Old log files only; retain recent diagnostic history.
for base, dirs, files in os.walk(HOME / 'Library/Logs', followlinks=False):
    for name in files:
        candidate(Path(base) / name, 'logs antigos', 7)
# Weekly cache targets, omitting installed software, profiles and preferences.
weekly = (ROOT / 'scripts/limpeza-semanal-segura.sh').read_text()
for rel in re.findall(r'"\$HOME_DIR/([^"\n]+)"', weekly):
    if rel.startswith('.cache/') or rel == 'Library/Application Support/Google/GoogleUpdater':
        continue
    if rel.endswith(('Safe Browsing', 'CertificateRevocation')):
        continue
    if rel.endswith('Chrome') and '/Caches/' not in rel:
        continue
    candidate(HOME / rel, 'caches semanais')
for profile in (HOME / 'Library/Application Support/Figma/DesktopProfile').glob('v*'):
    for name in ['Cache', 'Code Cache', 'GPUCache', 'DawnWebGPUCache', 'DawnGraphiteCache', 'Crashpad', 'Shared Dictionary']:
        candidate(profile / name, 'caches Figma')
for name in ['_cacache', '_logs']:
    candidate(HOME / '.npm' / name, 'cache npm', 0)
# Reuse project-cache discovery only, without deleting saved news editions.
spec = importlib.util.spec_from_file_location('news_cleanup', HOME / 'automacoes/codex-fluxo/maintenance/news_retention_cleanup.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.remove_path = lambda path, **kwargs: candidate(path, 'caches dos projetos', 3)
module.cleanup_old_cache_entries(NOW - 3 * 86400, dry_run=True, removed=[], warnings=warnings)
# Deduplicate nested targets.
unique = []
for item in sorted(selected, key=lambda v: len(v['path'])):
    path = Path(item['path'])
    if not any(path == Path(x['path']) or Path(x['path']) in path.parents for x in unique):
        unique.append(item)
report = {'mode': 'execute' if MODE else 'plan', 'targets': unique, 'skipped': skipped, 'warnings': warnings,
          'estimated_bytes': sum(x['bytes'] for x in unique), 'removed': [], 'failed': [],
          'disk_free_before': shutil.disk_usage(HOME).free,
          'preserved': ['arquivos pessoais e duplicados', 'Downloads', 'Lixeira', 'apps instalados', 'perfis', 'preferencias', 'modelos e runtimes locais', 'edicoes salvas de news']}
if MODE:
    for item in unique:
        p = Path(item['path'])
        try:
            # Recheck age immediately before deletion.
            size, newest = examine(p)
            if newest > time.time() - item['min_days'] * 86400:
                continue
            if p.is_dir():
                shutil.rmtree(p)
            else:
                p.unlink()
            report['removed'].append(dict(item, bytes=size))
            print('REMOVIDO', p, size, flush=True)
        except OSError as exc:
            report['failed'].append({'path': str(p), 'error': str(exc)})
    report['disk_free_after'] = shutil.disk_usage(HOME).free
    report['removed_bytes'] = sum(x['bytes'] for x in report['removed'])
    report['remaining_removed_targets'] = [x['path'] for x in report['removed'] if Path(x['path']).exists()]
(OUT / ('resultado.json' if MODE else 'plano.json')).write_text(json.dumps(report, indent=2, ensure_ascii=False))
print(json.dumps({k: v for k,v in report.items() if k not in ['targets','skipped','warnings','removed','failed']}, ensure_ascii=False))
print('Alvos:', len(unique), 'Ignorados:', len(skipped), 'Avisos:', len(warnings), 'Falhas:', len(report['failed']))
for item in sorted(unique, key=lambda x: x['bytes'], reverse=True)[:12]:
    print(round(item['bytes']/1024**2, 1), 'MiB', item['path'])
