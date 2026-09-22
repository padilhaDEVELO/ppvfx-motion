from pathlib import Path
import json,shutil,hashlib,os,re
import yaml

BASE=Path(__file__).resolve().parent
ROOTS={
    'shared':Path('/Users/ppvfx/.agents/skills'),
    'codex':Path('/Users/ppvfx/.codex/skills'),
    'claude':Path('/Users/ppvfx/.claude/skills'),
    'opencode':Path('/Users/ppvfx/.config/opencode/skills'),
}
inventory=json.loads((BASE/'inventario.json').read_text())
names=sorted({r['name'] for r in inventory})
actions=[]
backup=BASE/'backup-cabecalhos';backup.mkdir(exist_ok=True)

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def journal():
    (BASE/'alteracoes.json').write_text(json.dumps(actions,ensure_ascii=False,indent=2))
def link(dest,target):
    if dest.exists() or dest.is_symlink():return
    assert target.exists(),target
    dest.symlink_to(target,target_is_directory=True)
    actions.append({'type':'symlink','path':str(dest),'target':str(target)})
    journal()

# Preserve every pre-existing Codex skill exactly as it was.
codex_before={r['path']:r['skill_hash'] for r in inventory if r['origin']=='codex'}

# Four descriptions contain a colon followed by a space in an unquoted YAML scalar.
# Quote only that value. The body and the description text remain unchanged.
for name in ['opensquad-skill-creator','opensquad','corte-opus-xml-padilha','corte-video-respect']:
    skill=(ROOTS['shared']/name/'SKILL.md').resolve()
    original=skill.read_text()
    try:
        yaml.safe_load(original.split('---',2)[1])
        continue
    except yaml.YAMLError:pass
    matched=re.search(r'^description: (.+)$',original,re.M);assert matched,skill
    value=matched.group(1)
    fixed=original[:matched.start()]+f'description: {json.dumps(value,ensure_ascii=False)}'+original[matched.end():]
    assert yaml.safe_load(fixed.split('---',2)[1])['description']==value
    assert original.split('---',2)[2]==fixed.split('---',2)[2]
    saved=backup/f'{name}.SKILL.md';saved.write_bytes(skill.read_bytes())
    mode=skill.stat().st_mode
    temp=skill.with_name('SKILL.md.import-temp')
    assert not temp.exists()
    temp.write_text(fixed);temp.chmod(mode);temp.replace(skill)
    actions.append({'type':'yaml-format','path':str(skill),'backup':str(saved),'before_sha256':digest(saved),'after_sha256':digest(skill)})
    journal()

# Keep the original Codex variants. Import the other versions under explicit names.
for original_name in ['copywriting','netlify-deploy']:
    alias=original_name+'-claude';dest=ROOTS['shared']/alias
    source=ROOTS['claude']/original_name
    assert not dest.exists() and not dest.is_symlink(),dest
    shutil.copytree(source.resolve(),dest,symlinks=True,copy_function=shutil.copyfile,
                    ignore=shutil.ignore_patterns('__pycache__','*.pyc','.DS_Store','._*','.git'))
    skill=dest/'SKILL.md';text=skill.read_text()
    edited,count=re.subn(r'^name: '+re.escape(original_name)+r'\s*$',f'name: {alias}',text,count=1,flags=re.M)
    assert count==1
    assert text.split('---',2)[2]==edited.split('---',2)[2]
    skill.write_text(edited)
    actions.append({'type':'version-copy','path':str(dest),'source':str(source.resolve()),'original_name':original_name,'imported_name':alias})
    journal();names.append(alias)

names=sorted(names)
for name in names:
    canonical=ROOTS['shared']/name
    assert (canonical/'SKILL.md').is_file(),canonical
    for origin in ['codex','claude','opencode']:
        link(ROOTS[origin]/name,canonical)

# This is a dependency bundle, not a standalone skill. Keep its scripts and templates accessible.
support=Path('/Users/ppvfx/.claude/skills/podcast-shared').resolve()
link(ROOTS['shared']/'podcast-shared',support)
for origin in ['codex','opencode']:
    link(ROOTS[origin]/'podcast-shared',ROOTS['shared']/'podcast-shared')

for p,h in codex_before.items():assert digest(Path(p)/'SKILL.md')==h,p

validation={}
for origin,root in ROOTS.items():
    count=0
    for name in names:
        p=root/name;assert p.exists() and (p/'SKILL.md').is_file(),p
        text=(p/'SKILL.md').read_text();assert text.startswith('---\n'),p
        meta=yaml.safe_load(text.split('---',2)[1])
        assert isinstance(meta.get('name'),str) and meta['name'].strip(),p
        assert isinstance(meta.get('description'),str) and meta['description'].strip(),p
        count+=1
    assert (root/'podcast-shared/scripts').is_dir()
    broken=[p.name for p in root.iterdir() if p.is_symlink() and not p.exists()]
    assert not broken,(root,broken)
    validation[origin]={'main_skills':count,'broken_root_links':broken,'podcast_support':True}

validation['nested_skill']={'path':str(ROOTS['codex']/'video-use/skills/manim-video/SKILL.md'),'accessible':(ROOTS['codex']/'video-use/skills/manim-video/SKILL.md').is_file()}
validation['original_codex_skills_preserved']=len(codex_before)
validation['added_codex_skill_links']=sum(a['type']=='symlink' and Path(a['path']).parent==ROOTS['codex'] and Path(a['path']).name!='podcast-shared' for a in actions)
(BASE/'validacao.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2))
lines=['INTEGRAÇÃO LOCAL DE SKILLS — CODEX, CLAUDE CODE E OPENCODE','',
       'Inventário inicial: 310 nomes de skills principais. Codex: 69 instalações diretas; Claude: 310; OpenCode: 18.',
       'Resultado: 312 skills principais acessíveis nos três ambientes e na biblioteca compartilhada, mais a subskill manim-video dentro de video-use.',
       'Foram adicionados 243 vínculos de skills ao Codex (241 nomes ausentes + 2 variantes), além do pacote auxiliar podcast-shared.',
       'As 69 skills preexistentes do Codex foram preservadas.',
       'As versões do Claude de copywriting e netlify-deploy foram preservadas separadamente como copywriting-claude e netlify-deploy-claude.',
       'A instalação usa vínculos para manter disponíveis os arquivos completos: SKILL.md, scripts, referências e recursos.',
       'Foram corrigidos apenas os cabeçalhos YAML de opensquad-skill-creator, opensquad, corte-opus-xml-padilha e corte-video-respect. O corpo das instruções não mudou.',
       'Os quatro cabeçalhos originais estão em backup-cabecalhos. Os caminhos e as alterações estão em alteracoes.json.',
       'Validação: frontmatter legível, nome e descrição presentes, nenhum vínculo quebrado e pacote auxiliar de podcast acessível.',
       'A validação verifica instalação e carregabilidade dos arquivos; não executa os serviços ou scripts de cada skill.',
       'Nenhuma automação de sincronização contínua foi instalada. Os vínculos refletem mudanças nos pacotes originais; as duas variantes são cópias preservadas.',
       '', 'SKILLS PRINCIPAIS DISPONÍVEIS NO CODEX','']+names
(BASE/'RELATORIO.txt').write_text('\n'.join(lines)+'\n')
print(json.dumps(validation,ensure_ascii=False,indent=2))
