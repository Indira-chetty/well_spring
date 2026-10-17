import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {dirname} from 'node:path';
import {seed,mutate} from '../app/domain.ts';
import {ensureCRM,mutateCRM} from '../app/crm.ts';
import {generateReport} from '../app/ai.ts';
export function createStore(file){
 let queue=Promise.resolve();
 async function load(){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return {state:ensureCRM(seed()),version:0};}}
 async function save(data){await mkdir(dirname(file),{recursive:true});const tmp=file+'.tmp';await writeFile(tmp,JSON.stringify(data),'utf8');await rename(tmp,file);}
 return {read:async()=>{await queue;return load();},write(input){const task=queue.then(async()=>{const data=await load();if(input.version!==data.version){const e=new Error('Workspace changed. Reloading the latest records.');e.status=409;throw e;}const state=ensureCRM(data.state),p=input.payload||{},actor='Local demo user';if(input.action==='aiDraft'){const r=await generateReport(String(input.apiKey||''),state,p);mutate(state,'draft',p,actor);Object.assign(state.drafts[0],{text:r.text,generation:'Gemini AI',model:r.model,tokens:r.tokens});state.activity[0].title='Live AI draft generated';}else if(String(input.action).startsWith('crm'))mutateCRM(state,input.action,p,actor);else mutate(state,input.action,p,actor);const next={state,version:data.version+1};await save(next);return next;});queue=task.catch(()=>{});return task;}};
}
