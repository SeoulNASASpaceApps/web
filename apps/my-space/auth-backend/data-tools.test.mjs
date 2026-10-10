import test from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';
import {reconcile,applyReconciliation,importTeams} from './data-tools.mjs';
const database=()=>{const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));return db;};
test('reconciliation flags duplicates, name differences, missing guardian checks and missing forms',()=>{
 const nasa=[{nasa_email:'A@example.com',name:'A',seoul_registered:true},{nasa_email:'b@example.com',name:'B',seoul_registered:true},{nasa_email:'c@example.com',name:'C',seoul_registered:true}];
 const form=[{nasa_email:'a@example.com',name:'A',guardian_status:'not_required'},{nasa_email:'b@example.com',name:'다른 이름',guardian_status:'verified'}];
 const rows=reconcile(nasa,form);assert.equal(rows[0].eligible,true);assert.equal(rows[1].review_reason,'name_difference');assert.equal(rows[2].review_reason,'missing_or_duplicate');
 const dup=reconcile([nasa[0],nasa[0]],[form[0]]);assert.equal(dup[0].eligible,false);
 const db=database();applyReconciliation(db,rows,'space-apps-seoul-2026');const id=db.prepare('SELECT id FROM participants WHERE nasa_email=?').get('a@example.com').id;applyReconciliation(db,rows,'space-apps-seoul-2026');assert.equal(db.prepare('SELECT id FROM participants WHERE nasa_email=?').get('a@example.com').id,id);assert.equal(db.prepare('SELECT approval_status FROM participants WHERE id=?').get(id).approval_status,'pending');db.close();
});
test('official team updates preserve owner and hub recruitment settings; empty or invalid snapshots never delete',()=>{
 const db=database(),snapshot={collected_at:'2026-10-09T09:00:00Z',source_url:'https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams',teams:[{external_id:'external-1',official_url:'https://www.spaceappschallenge.org/2026/teams/test/',name:'Old name',challenge:'Moon',seeking_members:true}]};
 importTeams(db,snapshot,'event');db.prepare("UPDATE teams SET recruitment_status='completed',recruitment_copy='keep me'").run();const id=db.prepare('SELECT id FROM teams').get().id;
 snapshot.teams[0].name='New name';snapshot.teams[0].seeking_members=false;importTeams(db,snapshot,'event');const row=db.prepare('SELECT * FROM teams').get();assert.equal(row.id,id);assert.equal(row.name,'New name');assert.equal(row.official_seeking,0);assert.equal(row.recruitment_status,'completed');assert.equal(row.recruitment_copy,'keep me');
 assert.throws(()=>importTeams(db,{...snapshot,teams:[]},'event'));assert.equal(db.prepare('SELECT COUNT(*) n FROM teams').get().n,1);assert.throws(()=>importTeams(db,{...snapshot,teams:[{...snapshot.teams[0],official_url:'https://attacker.test'}]},'event'));db.close();
});
