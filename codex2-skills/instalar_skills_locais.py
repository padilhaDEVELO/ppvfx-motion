from pathlib import Path
import json,re
h=Path.home()
out=Path('/Users/ppvfx/Documents/IA/output/codex2-skills')
roots=[h/'.codex2/skills',h/'.agents/skills',h/'.claude/skills',h/'.config/opencode/skills']
created=[]
existing=[]
conflicts=[]
def link(src,dst):
 if dst.exists() or dst.is_symlink():
  if dst.resolve()==src.resolve():existing.append(str(dst))
  else:conflicts.append(str(dst))
  return
 dst.parent.mkdir(parents=True,exist_ok=True)
 dst.symlink_to(src,target_is_directory=True)
 created.append({'link':str(dst),'target':str(src)})
# Reuse the existing shared collection, retaining each skill's support files.
base=[p for p in sorted((h/'.codex/skills').iterdir()) if (p/'SKILL.md').is_file() and not p.name.startswith('.')]
for skill in base:
 link(skill,h/'.codex2/skills'/skill.name)
# Prefer the current remote plugin bundle over older curated bundles for the same plugin.
cache=h/'.codex/plugins/cache'
plugins={}
for market in ['openai-curated','openai-bundled','openai-primary-runtime','openai-curated-remote']:
 root=cache/market
 if not root.exists():continue
 for plugin in sorted(root.iterdir()):
  if not plugin.is_dir():continue
  versions=[p for p in plugin.iterdir() if p.is_dir() and not p.is_symlink() and (p/'skills').is_dir()]
  if not versions:continue
  def key(p):return tuple(int(x) for x in re.findall(r'\d+',p.name)),p.stat().st_mtime
  plugins[plugin.name]=max(versions,key=key)
plugin_skills=[]
for name,bundle in sorted(plugins.items()):
 for manifest in sorted((bundle/'skills').rglob('SKILL.md')):
  skill=manifest.parent
  relative=skill.relative_to(bundle/'skills')
  dest_name='plugin-'+name+'--'+'--'.join(relative.parts)
  plugin_skills.append({'plugin':name,'name':dest_name,'source':str(skill)})
  for root in roots:link(skill,root/dest_name)
report={'base_skills':len(base),'plugin_skills':plugin_skills,'created':created,'existing_count':len(existing),'conflicts':conflicts}
(out/'instalacao.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print('Skills locais vinculadas ao codex2:',len(base))
print('Skills de plugins disponibilizadas:',len(plugin_skills))
print('Links criados:',len(created))
print('Conflitos preservados:',conflicts)
print('Links quebrados:',[x['link'] for x in created if not (Path(x['link'])/'SKILL.md').is_file()])
