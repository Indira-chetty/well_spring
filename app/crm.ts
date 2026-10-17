import type {State,Item} from './domain.ts';
export const systems=['SupporterHub','CiviCRM','Odoo','SuiteCRM'] as const;
export type System=typeof systems[number];
export const costFields=['licence','hosting','support','migration','setup','training'] as const;
export function ensureCRM(s:State):State{
 if(!s.crm){s.crm={active:'SupporterHub',test:null,costs:{},decision:null};
 if(!s.supporters.some(x=>x.id==='s-duplicate'))s.supporters.push({id:'s-duplicate',name:'Supporter 001',fund:'Nepal school toilets',amount:5000,consent:false,unsubscribed:false,synced:false,question:'Potential duplicate record from a sample import.',consentVerified:false});}
 for(const r of s.supporters)r.consentVerified??=false;
 return s;
}
export function canonical(s:State){return s.supporters.filter(x=>!x.mergedInto).map(x=>({id:x.id,name:x.name,fund:x.fund,amount:x.amount,emailConsent:!!x.consent,unsubscribed:!!x.unsubscribed})).sort((a,b)=>a.id.localeCompare(b.id));}
export function toSource(system:System,r:ReturnType<typeof canonical>[number]):any{
 switch(system){
 case 'SupporterHub':return {supporter_id:r.id,display_name:r.name,fund_name:r.fund,gift_value:r.amount,email_opt_in:r.emailConsent,opt_out:r.unsubscribed};
 case 'CiviCRM':return {contact_id:r.id,display_name:r.name,contribution:{fund:r.fund,total_amount:r.amount},communication:{email_allowed:r.emailConsent,unsubscribed:r.unsubscribed}};
 case 'Odoo':return {partner:{reference:r.id,label:r.name},donation:{fund:r.fund,total:r.amount},preferences:{email:r.emailConsent,unsubscribed:r.unsubscribed}};
 case 'SuiteCRM':return {contact_ref:r.id,full_name:r.name,donation_fund:r.fund,donation_amount:r.amount,allow_email:r.emailConsent,email_opt_out:r.unsubscribed};
 }
}
export function fromSource(system:System,r:any){switch(system){case 'SupporterHub':return {id:r.supporter_id,name:r.display_name,fund:r.fund_name,amount:r.gift_value,emailConsent:r.email_opt_in,unsubscribed:r.opt_out};case 'CiviCRM':return {id:r.contact_id,name:r.display_name,fund:r.contribution.fund,amount:r.contribution.total_amount,emailConsent:r.communication.email_allowed,unsubscribed:r.communication.unsubscribed};case 'Odoo':return {id:r.partner.reference,name:r.partner.label,fund:r.donation.fund,amount:r.donation.total,emailConsent:r.preferences.email,unsubscribed:r.preferences.unsubscribed};case 'SuiteCRM':return {id:r.contact_ref,name:r.full_name,fund:r.donation_fund,amount:r.donation_amount,emailConsent:r.allow_email,unsubscribed:r.email_opt_out};}}
export function portability(s:State){const expected=canonical(s);return systems.map(system=>{const normalized=expected.map(r=>fromSource(system,toSource(system,r)));return {system,passed:JSON.stringify(normalized)===JSON.stringify(expected),count:normalized.length};});}
export function fiveYearCost(cost:any):number|null{if(!cost||costFields.some(k=>cost[k]===''||cost[k]===undefined))return null;return 5*(Number(cost.licence)+Number(cost.hosting)+Number(cost.support))+Number(cost.migration)+Number(cost.setup)+Number(cost.training);}
export function mutateCRM(s:State,action:string,p:any,actor:string){ensureCRM(s);const c=s.crm!;const now=new Date().toISOString();const log=(title:string,detail:string)=>s.activity.unshift({id:crypto.randomUUID(),title,detail:actor+' · '+detail,at:now});
const find=(id:string)=>{const r=s.supporters.find(r=>r.id===id&&!r.mergedInto);if(!r)throw Error('Active supporter record not found.');return r;};
switch(action){
case 'crmSwitch':if(!systems.includes(p.system))throw Error('Unsupported CRM');c.active=p.system;log('Demo CRM source changed',p.system+' · simulated adapter');break;
case 'crmTest':c.test={at:now,results:portability(s)};log('Synthetic connector test completed',c.test.results.every((r:any)=>r.passed)?'All four adapters preserve the same records.':'A mapping requires review.');break;
case 'crmMerge':{const source=find(p.source),target=find(p.target);if(source.id===target.id)throw Error('Choose two different records.');if(source.name.trim().toLowerCase()!==target.name.trim().toLowerCase())throw Error('These are not the suggested duplicate pair.');if(!String(p.note||'').trim())throw Error('Record your merge decision before approving.');target.consent=!!target.consent&&!!source.consent;target.unsubscribed=!!target.unsubscribed||!!source.unsubscribed;target.synced=false;target.consentVerified=false;source.mergedInto=target.id;source.mergeNote=String(p.note).slice(0,1000);source.mergedAt=now;source.mergedBy=actor;c.test=null;log('Supporter merge approved',source.id+' → '+target.id+' · '+source.mergeNote);break;}
case 'crmVerify':{const r=find(p.id);if(!String(p.note||'').trim())throw Error('A verification source or note is required.');r.consentVerified=true;r.consentNote=String(p.note).slice(0,1000);log('Consent evidence reviewed',r.id+' · '+r.consentNote+' · permission unchanged');break;}
case 'crmCosts':{if(!systems.includes(p.system))throw Error('Unsupported CRM');const entry:any={};for(const k of costFields){const v=p[k];if(v===''||v===undefined){entry[k]='';continue;}const n=Number(v);if(!Number.isFinite(n)||n<0||n>1e9)throw Error('Use non-negative cost estimates.');entry[k]=n;}entry.note=String(p.note||'').slice(0,1000);entry.at=now;c.costs[p.system]=entry;log('Five-year cost assumptions saved',p.system);break;}
case 'crmCriteria':{if(!systems.includes(p.system))throw Error('Unsupported CRM');const keys=['receipts','restricted','recurring','consent','french','canada','export','connector'];c.criteria??={};const entry:any={};for(const k of keys){if(!['To verify','Meets need','Gap'].includes(p[k]))throw Error('Invalid assessment');entry[k]=p[k];}entry.note=String(p.note||'').slice(0,1000);c.criteria[p.system]=entry;log('CRM assessment saved',p.system+' · user assessment');break;}
case 'crmDecision':{if(!['Renew','Replace','Renegotiate','Continue evaluation'].includes(p.choice))throw Error('Select a decision');if(!String(p.note||'').trim())throw Error('Include the supporting evidence');c.decision={choice:p.choice,note:String(p.note).slice(0,2000),actor,at:now,evidence:{connectorTest:c.test,costs:structuredClone(c.costs),criteria:structuredClone(c.criteria||{})}};log('CRM decision recorded',p.choice+' · '+c.decision.note);break;}
default:throw Error('Unknown CRM action');}
return s;}
