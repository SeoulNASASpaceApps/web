import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const root=dirname(fileURLToPath(import.meta.url));
const email=value=>{if(typeof value!=='string'||!/^\S+@[^\s@]+\.[^\s@]+$/.test(value.trim())||value.length>254)throw new Error('Invalid NASA email in input.');return value.trim().toLowerCase();};
const index=rows=>{if(!Array.isArray(rows))throw new Error('Input must be an array.');const map=new Map();for(const row of rows){const key=email(row.nasa_email);if(!map.has(key))map.set(key,[]);map.get(key).push(row);}return map;};
export function reconcile(official,seoul){
 const a=index(official),b=index(seoul),result=[];
 for(const key of new Set([...a.keys(),...b.keys()])){
  const officialRows=a.get(key)||[],seoulRows=b.get(key)||[],unique=officialRows.length===1&&seoulRows.length===1;
  const nasa=officialRows[0],form=seoulRows[0];
  const guardian=form?.guardian_status||'pending';
  const namesMatch=unique&&typeof nasa.name==='string'&&typeof form.name==='string'&&nasa.name.trim().toLowerCase()===form.name.trim().toLowerCase();
  const confirmed=unique&&nasa.seoul_registered===true;
  result.push({nasa_email:key,name:form?.name||nasa?.name||'',official_count:officialRows.length,seoul_count:seoulRows.length,official_confirmed:confirmed,seoul_confirmed:unique,guardian_status:guardian,eligible:confirmed&&['not_required','verified'].includes(guardian),review_reason:!unique?'missing_or_duplicate':!confirmed?'seoul_registration_unconfirmed':!namesMatch?'name_difference':!['not_required','verified'].includes(guardian)?'guardian_review':'matched'});
 }
 return result;
}
export function applyReconciliation(db,rows,event){
 db.exec('BEGIN IMMEDIATE');try{for(const row of rows){
  const prior=db.prepare('SELECT id FROM participants WHERE event_id=? AND nasa_email=?').all(event,row.nasa_email);
  if(prior.length>1||row.official_count>1||row.seoul_count>1){db.prepare('UPDATE participants SET eligible=0,updated_at=? WHERE event_id=? AND nasa_email=?').run(Date.now()/1000|0,event,row.nasa_email);continue;}
  if(prior.length===1){db.prepare('UPDATE participants SET name=?,official_confirmed=?,seoul_confirmed=?,guardian_status=?,eligible=?,updated_at=? WHERE id=?').run(row.name,Number(row.official_confirmed),Number(row.seoul_confirmed),row.guardian_status,Number(row.eligible),Date.now()/1000|0,prior[0].id);}
  else db.prepare('INSERT INTO participants VALUES(?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),event,row.nasa_email,row.name,Number(row.official_confirmed),Number(row.seoul_confirmed),row.guardian_status,Number(row.eligible),'pending',Date.now()/1000|0);
 }db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
}
export function importTeams(db,snapshot,event){
 if(!Array.isArray(snapshot.teams)||!snapshot.teams.length||!snapshot.collected_at||Number.isNaN(Date.parse(snapshot.collected_at)))throw new Error('A nonempty dated snapshot is required; failures do not remove existing teams.');
 const source=new URL(snapshot.source_url);if(source.protocol!=='https:'||source.hostname!=='www.spaceappschallenge.org'||!source.pathname.startsWith('/2026/local-events/seoul/'))throw new Error('Unexpected official source URL.');
 const seen=new Set();const checked=snapshot.teams.map(team=>{
  const url=new URL(team.official_url);if(url.protocol!=='https:'||url.hostname!=='www.spaceappschallenge.org')throw new Error('Unexpected official team URL.');
  const external=team.external_id?String(team.external_id):url.origin+url.pathname;
  if(seen.has(external)||typeof team.name!=='string'||!team.name.trim())throw new Error('Duplicate or missing team identity.');seen.add(external);
  return {...team,official_url:url.toString(),external_id:external};
 });
 db.exec('BEGIN IMMEDIATE');try{for(const team of checked){db.prepare(`INSERT INTO teams(id,event_id,external_id,official_url,name,challenge,official_seeking,last_seen_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(event_id,external_id) DO UPDATE SET official_url=excluded.official_url,name=excluded.name,challenge=excluded.challenge,official_seeking=excluded.official_seeking,last_seen_at=excluded.last_seen_at`).run(randomUUID(),event,team.external_id,team.official_url,team.name,team.challenge||null,typeof team.seeking_members==='boolean'?Number(team.seeking_members):null,snapshot.collected_at);}db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
 return {updated:checked.length};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{
  const [mode,first,second]=process.argv.slice(2),apply=process.argv.includes('--apply');
  const read=path=>JSON.parse(readFileSync(resolve(path),'utf8'));
  if(mode==='reconcile'){
   const report=reconcile(read(first),read(second));
   if(apply){const path=process.env.HUB_DB_PATH||resolve(root,'private/hub.sqlite');mkdirSync(dirname(path),{recursive:true,mode:0o700});const db=new DatabaseSync(path);db.exec(readFileSync(resolve(root,'schema.sql'),'utf8'));applyReconciliation(db,report,process.env.EVENT_ID||'space-apps-seoul-2026');db.close();}
   // No raw emails/names on stdout; detailed private report stays in memory.
   console.log(JSON.stringify({total:report.length,matched:report.filter(x=>x.review_reason==='matched').length,review_needed:report.filter(x=>x.review_reason!=='matched').length,applied:apply}));
  }else if(mode==='teams'){
   if(!apply)throw new Error('Teams import requires --apply.');const path=process.env.HUB_DB_PATH||resolve(root,'private/hub.sqlite');mkdirSync(dirname(path),{recursive:true,mode:0o700});const db=new DatabaseSync(path);db.exec(readFileSync(resolve(root,'schema.sql'),'utf8'));console.log(JSON.stringify(importTeams(db,read(first),process.env.EVENT_ID||'space-apps-seoul-2026')));db.close();
  }else throw new Error('Use reconcile official.json seoul.json [--apply], or teams snapshot.json --apply.');
 }catch(error){console.error('Import failed. No source files were modified. Check the input and private runtime configuration.');process.exitCode=1;}
}
