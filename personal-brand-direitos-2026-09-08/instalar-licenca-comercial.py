#!/usr/bin/env python3
"""Aplica exclusivamente a versão comercial revisada e os três novos vínculos."""
from pathlib import Path
import hashlib
import json
import shutil
import sys

BASE = Path('/Users/ppvfx/Documents/IA/output/personal-brand-direitos-2026-09-08')
PLAN = json.loads((BASE / 'plano-instalacao.json').read_text())
SOURCE = BASE / 'personal-brand-padilha'
OLD = Path('/Users/ppvfx/.agents/skills/personal-brand')
NEW = Path('/Users/ppvfx/.agents/skills/personal-brand-padilha')
STAGE = Path('/Users/ppvfx/.agents/.personal-brand-padilha-install-20260908')
BACKUP = BASE / 'backup-personal-brand-anterior'
ROOTS = [Path(p) for p in PLAN['agent_roots']]

def hashes(root):
    return {f.relative_to(root).as_posix(): hashlib.sha256(f.read_bytes()).hexdigest()
            for f in sorted(root.rglob('*')) if f.is_file() and '__pycache__' not in f.parts}

assert str(SOURCE) == PLAN['source'] and str(OLD) == PLAN['old_destination'] and str(NEW) == PLAN['destination']
assert hashes(SOURCE) == PLAN['source_hashes'], 'Versão preparada foi alterada.'
assert OLD.is_dir() and not OLD.is_symlink() and hashes(OLD) == PLAN['previous_hashes'], 'Instalação anterior mudou.'
assert OLD.stat().st_dev == BASE.stat().st_dev, 'Backup requer mesmo volume.'
for p in [NEW, STAGE, BACKUP]: assert not p.exists() and not p.is_symlink(), 'Destino já ocupado: ' + str(p)
for root in ROOTS:
    old_link, new_link = root / OLD.name, root / NEW.name
    assert old_link.is_symlink() and old_link.resolve() == OLD, 'Vínculo anterior inesperado.'
    assert not new_link.exists() and not new_link.is_symlink(), 'Novo nome já ocupado.'

if sys.argv[1:] != ['--apply']:
    print(json.dumps({'status':'pronto','name':NEW.name,'files':len(PLAN['source_hashes']),
                      'license':'commercial-paid','backup':str(BACKUP),
                      'new_links':[str(p / NEW.name) for p in ROOTS]}, ensure_ascii=False, indent=2))
    raise SystemExit(0)

shutil.copytree(SOURCE, STAGE, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '._*'))
assert hashes(STAGE) == PLAN['source_hashes']
OLD.rename(BACKUP)
created, removed = [], []
try:
    STAGE.rename(NEW)
    for root in ROOTS:
        link = root / NEW.name; link.symlink_to(NEW, target_is_directory=True); created.append(link)
    for root in ROOTS:
        link = root / OLD.name; link.unlink(); removed.append(link)
    assert hashes(NEW) == PLAN['source_hashes']
    for link in created: assert hashes(link) == PLAN['source_hashes']
except BaseException:
    for link in created:
        if link.is_symlink() and link.resolve() == NEW: link.unlink()
    if NEW.exists(): NEW.rename(STAGE)
    BACKUP.rename(OLD)
    for link in removed:
        if not link.exists() and not link.is_symlink(): link.symlink_to(OLD, target_is_directory=True)
    raise

result = {'status':'instalada_e_verificada','name':NEW.name,'license':'commercial-paid',
          'files':len(PLAN['source_hashes']),'canonical':str(NEW),'backup':str(BACKUP),
          'links':[str(p) for p in created],'sha256':hashes(NEW)}
(BASE / 'instalacao-verificada.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='sha256'},ensure_ascii=False,indent=2))
