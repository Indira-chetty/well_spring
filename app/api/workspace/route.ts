import {env} from 'cloudflare:workers';
import {seed,mutate} from '../../domain';
import {generateReport} from '../../ai';
import {ensureCRM,mutateCRM} from '../../crm.ts';
export const dynamic='force-dynamic';
function identity(r:Request){return r.headers.get('oai-authenticated-user-id');}
async function load(id:string){const db=env.DB!;await db.prepare('INSERT OR IGNORE INTO workspaces (id,payload,version) VALUES (?,?,0)').bind(id,JSON.stringify(seed())).run();return await db.prepare('SELECT payload,version FROM workspaces WHERE id=?').bind(id).first<{payload:string;version:number}>();}
export async function GET(r:Request){const id=identity(r);if(!id)return Response.json({error:'Sign in to access your workspace.'},{status:401});try{const row=await load(id);return Response.json({state:ensureCRM(JSON.parse(row!.payload)),version:row!.version});}catch{return Response.json({error:'Workspace could not be loaded. Please retry.'},{status:503});}}
export async function POST(r:Request){const id=identity(r);if(!id)return Response.json({error:'Sign in required.'},{status:401});if(r.headers.get('origin')&&r.headers.get('origin')!==new URL(r.url).origin)return Response.json({error:'Invalid origin'},{status:403});try{const b=await r.json() as any;if(JSON.stringify(b).length>60000)throw Error('Request is too large');const row=await load(id);if(b.version!==row!.version)return Response.json({error:'Workspace changed. Reloading the latest records.'},{status:409});const name=r.headers.get('oai-authenticated-user-full-name');let actor='Workspace owner';if(name)try{actor=decodeURIComponent(name);}catch{}const state=ensureCRM(JSON.parse(row!.payload));
let action=b.action;
if(String(action).startsWith('crm')){mutateCRM(state,action,b.payload||{},actor);}
else if(action==='aiDraft'){
 const result=await generateReport(String(b.apiKey||''),state,b.payload||{});
 mutate(state,'draft',b.payload,actor);
 const draft=state.drafts[0];draft.text=result.text;draft.generation='Gemini AI';draft.model=result.model;draft.tokens=result.tokens;
 state.activity[0].title='Live AI draft generated';state.activity[0].detail=actor+' · '+result.model+' · '+result.tokens+' tokens';
}else mutate(state,action,b.payload||{},actor);const result=await env.DB!.prepare('UPDATE workspaces SET payload=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),id,row!.version).run();if(!result.meta.changes)return Response.json({error:'Another change was saved. Please retry.'},{status:409});return Response.json({state,version:row!.version+1});}catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to save change'},{status:400});}}
