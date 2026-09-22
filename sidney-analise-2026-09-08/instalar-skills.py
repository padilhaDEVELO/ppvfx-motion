from pathlib import Path
import hashlib
import json
import os
import re
import shutil

SOURCE = Path('/Volumes/SSD_PP_FRZ/FILIPE/SIDNEY ANALISE/metodo-personal-brand')
CANONICAL = Path('/Users/ppvfx/.agents/skills/personal-brand')
ROOTS = [Path('/Users/ppvfx/.codex/skills'), Path('/Users/ppvfx/.config/opencode/skills'), Path('/Users/ppvfx/.claude/skills')]
CREATOR = Path('/Users/ppvfx/.agents/skills/skill-creator')
CREATOR_LINK = ROOTS[1] / 'skill-creator'

def manifest(folder):
    return {str(p.relative_to(folder)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(folder.rglob('*'))
            if p.is_file() and not p.name.startswith('._') and p.name != '.DS_Store'}

original = manifest(SOURCE)
assert len(original) == 5, 'Pacote de origem diferente dos cinco arquivos revisados'
assert (CREATOR / 'SKILL.md').is_file()
assert (ROOTS[0] / '.system/skill-creator/SKILL.md').is_file()
assert (ROOTS[2] / 'skill-creator/SKILL.md').is_file()
if os.path.lexists(CANONICAL):
    assert CANONICAL.is_dir() and manifest(CANONICAL) == original, 'Destino existente divergente; nada sera sobrescrito'
links = [(root / 'personal-brand', CANONICAL) for root in ROOTS] + [(CREATOR_LINK, CREATOR)]
for link, target in links:
    if os.path.lexists(link):
        assert link.is_symlink() and link.resolve() == target.resolve(), f'Destino existente: {link}'
if not CANONICAL.exists():
    shutil.copytree(SOURCE, CANONICAL, ignore=shutil.ignore_patterns('._*', '.DS_Store'))
for link, target in links:
    link.parent.mkdir(parents=True, exist_ok=True)
    if not os.path.lexists(link):
        link.symlink_to(os.path.relpath(target, link.parent), target_is_directory=True)
for root in [CANONICAL] + [r / 'personal-brand' for r in ROOTS]:
    assert manifest(root) == original, f'Falha de hash: {root}'
    for f in root.rglob('*.md'):
        for ref in re.findall(r'\]\(([^)]+)\)', f.read_text()):
            if '://' not in ref and not ref.startswith('#'):
                assert (f.parent / ref.split('#')[0]).exists(), f'Referencia ausente: {ref}'
result = {
    'personal-brand': {'canonical': str(CANONICAL), 'links': [str(r / 'personal-brand') for r in ROOTS], 'sha256': original},
    'skill-creator': {'codex': str(ROOTS[0] / '.system/skill-creator'), 'opencode': str(CREATOR_LINK), 'claude': str(ROOTS[2] / 'skill-creator'), 'existing_versions_preserved': True},
    'verification': 'Hashes dos cinco arquivos e referencias locais conferidos nos tres destinos.'
}
Path(__file__).with_name('instalacao-verificada.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
