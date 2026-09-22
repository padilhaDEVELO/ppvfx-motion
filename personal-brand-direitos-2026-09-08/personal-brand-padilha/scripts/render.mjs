#!/usr/bin/env node
// © 2026 personal-brand-padilha. Todos os direitos reservados. Licença proprietária: ../LICENSE
// Chrome DevTools Protocol, Node com WebSocket nativo. Nenhum pacote npm.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const args=process.argv.slice(2);
if(!args[0] || args.includes('--help')){
  console.log('Uso: node render.mjs PASTA_DA_VERSAO [--chrome CAMINHO_DO_EXECUTAVEL]');
  process.exit(args[0]?0:1);
}
if(typeof WebSocket==='undefined')throw Error('Node com WebSocket nativo necessário (testado em Node 24).');
const root=path.resolve(args[0]);
const digest=b=>createHash('sha256').update(b).digest('hex');
const buildPath=path.join(root,'manifesto-build.json');
const buildBytes=await fs.readFile(buildPath);
const build=JSON.parse(buildBytes);
const local=async rel=>{
  const file=await fs.realpath(path.resolve(root,rel));
  const relpath=path.relative(await fs.realpath(root),file);
  if(relpath==='..'||relpath.startsWith('..'+path.sep)||path.isAbsolute(relpath))throw Error('Arquivo fora da versão: '+rel);
  return file;
};
for(const [rel,hash] of Object.entries(build.files)){
  if(digest(await fs.readFile(await local(rel)))!==hash)throw Error('Arquivo alterado após build: '+rel);
}
for(const rel of ['apresentacao.pdf','qa/render.json']){
  try{await fs.access(path.join(root,rel));throw Error('Renderização já existe; construa uma nova versão.');}
  catch(e){if(e.code!=='ENOENT')throw e;}
}
const chromeIndex=args.indexOf('--chrome');
if(chromeIndex>=0&&!args[chromeIndex+1])throw Error('--chrome requer caminho.');
const candidates=chromeIndex>=0?[args[chromeIndex+1]]:[
  process.env.PERSONAL_BRAND_CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA?path.join(process.env.LOCALAPPDATA,'Google/Chrome/Application/chrome.exe'):null,
].filter(Boolean);
let chrome;
for(const file of candidates){try{await fs.access(file);chrome=file;break;}catch{}}
if(!chrome)throw Error('Chrome/Chromium não localizado; forneça --chrome. Nenhum download foi executado.');
const qa=path.join(root,'qa');await fs.mkdir(qa,{recursive:true});
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'personal-brand-render-'));
const output={status:'failed',build_sha256:digest(buildBytes),slides:build.slides,assets:build.assets.length,issues:[],files:{}};
let proc,socket,seq=0;const pending=new Map();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function command(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=++seq;
    const timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout CDP: '+method));},30000);
    pending.set(id,{resolve,reject,timer});
    socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
async function save(rel,bytes){
  const file=path.join(root,rel);await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,bytes);output.files[rel]=digest(bytes);
}
try{
  proc=spawn(chrome,['--headless','--disable-gpu','--disable-extensions','--disable-background-networking',
    '--no-first-run','--no-default-browser-check','--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],
    {windowsHide:true,stdio:['ignore','ignore','pipe']});
  const endpoint=await new Promise((resolve,reject)=>{
    let log='',finished=false;
    const done=(err,value)=>{if(finished)return;finished=true;clearTimeout(timer);err?reject(err):resolve(value);};
    const timer=setTimeout(()=>done(Error('Chrome não iniciou: '+log.slice(-1500))),30000);
    proc.on('error',e=>done(e));proc.on('exit',code=>done(Error('Chrome encerrou: '+code+' '+log.slice(-1000))));
    proc.stderr.on('data',b=>{log=(log+b).slice(-8000);const m=log.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m)done(null,m[1]);});
  });
  socket=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('Timeout WebSocket')),10000);socket.onopen=()=>{clearTimeout(t);resolve();};socket.onerror=e=>{clearTimeout(t);reject(Error('WebSocket: '+e.message));};});
  socket.onmessage=e=>{const m=JSON.parse(e.data);const p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}};
  socket.onclose=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Chrome fechou a conexão.'));}pending.clear();};
  const {targetId}=await command('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await command('Target.attachToTarget',{targetId,flatten:true});
  const send=(m,p)=>command(m,p,sessionId);
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+' '+(r.exceptionDetails.exception?.description||''));return r.result.value;};
  await send('Page.enable');await send('Network.enable');
  await send('Network.setBlockedURLs',{urls:['http://*','https://*']});
  const metrics=async(width,height)=>send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  const navigate=async file=>{
    const url=pathToFileURL(file).href;await send('Page.navigate',{url});
    let ready=false;
    for(let i=0;i<100;i++){
      if(await evaluate('location.href==='+JSON.stringify(url)+' && document.readyState==="complete"')){ready=true;break;}
      await pause(100);
    }
    if(!ready)throw Error('Documento não carregou: '+file);
    await evaluate('Promise.all([document.fonts.ready,...Array.from(document.images||[]).map(i=>i.decode())]).then(()=>true)');
  };
  await metrics(1280,720);await navigate(await local('apresentacao.html'));
  if(await evaluate('document.querySelectorAll(".slide").length')!==build.slides)throw Error('Quantidade de slides divergente.');
  const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  await save('apresentacao.pdf',Buffer.from(pdf.data,'base64'));
  const shots=[];
  await evaluate('document.body.classList.add("qa-single")');
  for(let i=0;i<build.slides;i++){
    await evaluate(`document.querySelectorAll('.slide').forEach((s,j)=>s.classList.toggle('qa-active',j===${i}));true`);
    const issues=await evaluate(`(()=>{
      const slide=document.querySelector('.qa-active'),content=slide.querySelector('.content'),safe=content.getBoundingClientRect(),bad=[];
      for(const el of content.querySelectorAll('h1,h3,p,article,img')){
        const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;
        if(r.left<safe.left-1||r.right>safe.right+1||r.bottom>safe.bottom+1)bad.push({text:el.textContent.slice(0,100),reason:'content_bounds'});
        if(!el.children.length&&el.textContent.trim()){
          const range=document.createRange();range.selectNodeContents(el);const t=range.getBoundingClientRect();
          if(t.left<safe.left-1||t.right>safe.right+1||t.bottom>safe.bottom+1)bad.push({text:el.textContent.slice(0,100),reason:'text_bounds'});
        }
      }
      const note=slide.querySelector('.notes').getBoundingClientRect();
      if(note.top<safe.bottom)bad.push({reason:'notes_overlap_content'});
      return bad;
    })()`);
    output.issues.push(...issues.map(x=>({slide:i+1,...x})));
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    const rel='qa/slide-'+String(i+1).padStart(2,'0')+'.png';
    const bytes=Buffer.from(shot.data,'base64');await save(rel,bytes);shots.push(bytes);
  }
  for(const asset of build.assets){
    await metrics(asset.width,asset.height);await navigate(await local(asset.file));
    const issues=await evaluate(`Array.from(document.querySelectorAll('text')).flatMap(e=>{const r=e.getBBox();return r.x<60||r.x+r.width>${asset.width-60}||r.y<40||r.y+r.height>${asset.height-40}?[{text:e.textContent,reason:'svg_text_bounds'}]:[]})`);
    output.issues.push(...issues.map(x=>({asset:asset.file,...x})));
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await save(asset.file.replace(/\.svg$/,'.png'),Buffer.from(shot.data,'base64'));
  }
  for(let start=0;start<shots.length;start+=6){
    const images=shots.slice(start,start+6).map(b=>'<img src="data:image/png;base64,'+b.toString('base64')+'">').join('');
    const board='<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#444;display:grid;grid-template-columns:640px 640px;gap:4px}img{width:640px;height:360px}</style>'+images;
    // HTML intermediário só no diretório temporário próprio, fora do pacote.
    const file=path.join(profile,'board.html');await fs.writeFile(file,board);
    await metrics(1284,Math.ceil(Math.min(6,shots.length-start)/2)*364-4);await navigate(file);
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await save('qa/painel-'+String(start/6+1).padStart(2,'0')+'.png',Buffer.from(shot.data,'base64'));
  }
  output.status=output.issues.length?'failed':'passed';
}catch(e){output.issues.push({reason:'runtime',message:e.message});}
finally{
  if(socket?.readyState===WebSocket.OPEN){try{await command('Browser.close');}catch{}socket.close();}
  if(proc&&proc.exitCode===null){proc.kill();for(let i=0;i<20&&proc.exitCode===null;i++)await pause(100);if(proc.exitCode===null)proc.kill('SIGKILL');}
  for(const p of pending.values())clearTimeout(p.timer);
  await fs.rm(profile,{recursive:true,force:true}).catch(e=>output.issues.push({reason:'temp_cleanup',message:e.message}));
  if(output.issues.length)output.status='failed';
  await fs.writeFile(path.join(qa,'render.json'),JSON.stringify(output,null,2)+'\n');
}
console.log(JSON.stringify({status:output.status,slides:output.slides,assets:output.assets,issues:output.issues,qa:path.join(qa,'render.json')},null,2));
process.exitCode=output.status==='passed'?0:1;
