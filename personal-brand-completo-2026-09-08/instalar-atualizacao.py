#!/usr/bin/env python3
"""Instala somente a atualização revisada de personal-brand deste diretório."""
from pathlib import Path
import hashlib
import json
import shutil
import sys

BASE = Path('/Users/ppvfx/Documents/IA/output/personal-brand-completo-2026-09-08')
PLAN = json.loads((BASE / 'plano-instalacao.json').read_text())
SOURCE = BASE / 'personal-brand'
DEST = Path('/Users/ppvfx/.agents/skills/personal-brand')
STAGE = Path('/Users/ppvfx/.agents/.personal-brand-install-20260908')
BACKUP = BASE / 'backup-personal-brand-anterior'

def hashes(root):
    return {f.relative_to(root).as_posix(): hashlib.sha256(f.read_bytes()).hexdigest()
            for f in sorted(root.rglob('*')) if f.is_file() and '__pycache__' not in f.parts and not f.name.startswith('._')}

assert str(SOURCE) == PLAN['source'] and str(DEST) == PLAN['destination']
assert hashes(SOURCE) == PLAN['source_hashes'], 'A versão preparada mudou; revisar o plano.'
assert DEST.is_dir() and not DEST.is_symlink(), 'Destino inesperado.'
assert hashes(DEST) == PLAN['previous_hashes'], 'Instalação atual mudou; preservar e revisar.'
assert DEST.stat().st_dev == BASE.stat().st_dev, 'Backup exige o mesmo volume para troca atômica.'
assert not STAGE.exists() and not BACKUP.exists(), 'Staging ou backup já existe; preservar.'
for item in PLAN['links']:
    link = Path(item)
    assert link.is_symlink() and link.resolve() == DEST, 'Vínculo mudou: ' + item

if sys.argv[1:] != ['--apply']:
    print(json.dumps({'status': 'pronto', 'arquivos': len(PLAN['source_hashes']),
                      'destino': str(DEST), 'backup': str(BACKUP), 'vinculos': PLAN['links']}, ensure_ascii=False, indent=2))
    raise SystemExit(0)

shutil.copytree(SOURCE, STAGE, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '._*'))
assert hashes(STAGE) == PLAN['source_hashes'], 'Cópia de staging divergente.'
DEST.rename(BACKUP)
try:
    STAGE.rename(DEST)
    assert hashes(DEST) == PLAN['source_hashes']
    for item in PLAN['links']:
        assert hashes(Path(item)) == PLAN['source_hashes']
except BaseException:
    if DEST.exists(): DEST.rename(STAGE)
    BACKUP.rename(DEST)
    raise
result = {'status': 'instalada_e_verificada', 'files': len(PLAN['source_hashes']),
          'canonical': str(DEST), 'backup': str(BACKUP), 'agents': PLAN['links'],
          'sha256': hashes(DEST)}
(BASE / 'instalacao-verificada.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'sha256'}, ensure_ascii=False, indent=2))
