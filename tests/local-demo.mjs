import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createStore} from '../demo/storage.mjs';
const dir=await mkdtemp(join(tmpdir(),'wellspring-local-'));
try{const file=join(dir,'workspace.json'),a=createStore(file);const initial=await a.read();assert.equal(initial.version,0);assert.ok(initial.state.crm);const saved=await a.write({action:'task',payload:{title:'Local persistence check',team:'Operations'},version:0});assert.equal(saved.version,1);assert.ok(saved.state.tasks.some(x=>x.title==='Local persistence check'));const b=createStore(file);assert.equal((await b.read()).version,1);await assert.rejects(()=>b.write({action:'task',payload:{title:'Stale'},version:0}),/Workspace changed/);const results=await Promise.allSettled([b.write({action:'task',payload:{title:'A'},version:1}),b.write({action:'task',payload:{title:'B'},version:1})]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.doesNotMatch(await readFile(file,'utf8'),/apiKey/);console.log('Local demo passed: seeded startup, saved records across restarts, stale-write rejection and serialized writes.');}finally{await rm(dir,{recursive:true,force:true});}
