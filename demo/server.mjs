import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {createStore} from './storage.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const store=createStore(join(root,'.wellspring-demo','workspace.json'));
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
const api={name:'wellspring-local-api',configureServer(server){server.middlewares.use(async(req,res,next)=>{
 const host=req.headers.host||'';if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)){return json(res,403,{error:'Local demo only accepts loopback requests.'});}
 if(req.url?.startsWith('/api/workspace')){
  if(req.headers.origin&&req.headers.origin!==`http://${host}`)return json(res,403,{error:'Invalid origin'});
  try{if(req.method==='GET')return json(res,200,await store.read());if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
   let body='';for await(const chunk of req){body+=chunk;if(body.length>60000)throw Error('Request too large');}
   return json(res,200,await store.write(JSON.parse(body)));
  }catch(e){return json(res,e.status||400,{error:e.message||'Unable to save change'});}
 }
 if(req.url==='/'||req.url==='/index.html')req.url='/demo/index.html';
 if(req.url?.startsWith('/signin-with-chatgpt')){res.statusCode=302;res.setHeader('Location','/');res.end();return;}
 next();
 });}};
const server=await createServer({root,configFile:false,plugins:[api,react()],server:{host:'127.0.0.1',port:Number(process.env.WELLSPRING_DEMO_PORT)||5173,strictPort:true}});
try{await server.listen();console.log('\nWellspring local demo: http://127.0.0.1:'+(server.config.server.port)+'\nNo cloud setup or sign-in required. Sample records save in .wellspring-demo/.\nPress Ctrl+C to stop.\n');}catch(e){console.error('Could not start the demo: '+e.message+'\nIf port 5173 is busy, stop the other server and retry.');process.exitCode=1;await server.close();}
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,async()=>{await server.close();process.exit(0);});
