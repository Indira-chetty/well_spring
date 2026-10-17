import {spawnSync} from 'node:child_process';
if(!process.env.npm_execpath)throw Error('Run npm run install:ci.');
const result=spawnSync(process.execPath,[process.env.npm_execpath,'install','--no-audit','--no-fund','--legacy-peer-deps'],{stdio:'inherit'});
if(result.error)throw result.error;process.exit(result.status??1);
