import {spawnSync,spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13)){console.error('Wellspring needs Node.js 22.13 or later. Install a current Node.js LTS version, reopen the terminal, then run npm run demo again.');process.exit(1);}
if(!existsSync('node_modules/vite')||!existsSync('node_modules/react')){
 console.log('Installing project dependencies. This first step needs an internet connection…');
 const args=['install','--no-audit','--no-fund','--legacy-peer-deps'];
 const installed=process.env.npm_execpath?spawnSync(process.execPath,[process.env.npm_execpath,...args],{stdio:'inherit',cwd:root}):spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{stdio:'inherit',cwd:root,shell:process.platform==='win32'});
 if(installed.error||installed.status!==0){console.error('Dependency installation failed. Copy the error above so the team can diagnose it.');process.exit(installed.status||1);}
}
const child=spawn(process.execPath,['--experimental-strip-types','demo/server.mjs'],{stdio:'inherit',cwd:root,env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('error',e=>{console.error(e.message);process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;});
