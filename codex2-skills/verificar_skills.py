import subprocess,os,json,select,time,sys
from pathlib import Path
profile=sys.argv[1]
env=os.environ.copy()
env['CODEX_HOME']=str(Path.home()/profile)
p=subprocess.Popen(['codex','app-server','--stdio'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,env=env,text=True,bufsize=1)
def send(obj):
 p.stdin.write(json.dumps(obj)+'\n');p.stdin.flush()
def receive(target):
 deadline=time.monotonic()+25
 while time.monotonic()<deadline:
  if select.select([p.stdout],[],[],1)[0]:
   line=p.stdout.readline()
   if not line: raise RuntimeError('Servidor encerrou')
   obj=json.loads(line)
   if obj.get('id')==target:return obj
 raise RuntimeError('Tempo de resposta excedido')
try:
 send({'id':1,'method':'initialize','params':{'clientInfo':{'name':'local_skills_check','version':'1.0'}}})
 init=receive(1)
 if 'error' in init: raise RuntimeError(str(init['error']))
 send({'method':'initialized'})
 send({'id':2,'method':'skills/list','params':{'cwds':['/Users/ppvfx/Documents/IA'],'forceReload':True}})
 result=receive(2)
 if 'error' in result: raise RuntimeError(str(result['error']))
 output=Path('/Users/ppvfx/Documents/IA/output/codex2-skills')/(profile.strip('.')+'-'+sys.argv[2]+'.json')
 output.write_text(json.dumps(result['result'],indent=2,ensure_ascii=False))
 for item in result['result'].get('data',[]):
  skills=item.get('skills',[])
  print(profile,'skills:',len(skills),'desativadas:',sum(s.get('enabled') is False for s in skills),'erros:',item.get('errors',[]))
finally:
 p.terminate()
 try:p.wait(timeout=5)
 except subprocess.TimeoutExpired:p.kill();p.wait()
