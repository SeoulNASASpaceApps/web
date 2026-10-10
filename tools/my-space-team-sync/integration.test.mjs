import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {normalizeSnapshot} from './normalize-snapshot.mjs';
import {importTeams} from '../../apps/my-space/auth-backend/data-tools.mjs';
const raw=JSON.parse(readFileSync(new URL('./fixtures/public-seoul-teams-2026-10-09.json',import.meta.url),'utf8'));
test('real collector snapshot imports all 32 public teams, preserving IDs and hub recruitment',()=>{
 const snapshot=normalizeSnapshot(raw),db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('../../apps/my-space/auth-backend/schema.sql',import.meta.url),'utf8'));
 assert.equal(importTeams(db,snapshot,'space-apps-seoul-2026').updated,32);
 assert.equal(db.prepare('SELECT COUNT(*) n FROM teams WHERE official_seeking=1').get().n,17);
 const row=db.prepare('SELECT * FROM teams LIMIT 1').get();
 db.prepare("UPDATE teams SET recruitment_status='completed',recruitment_copy='preserve' WHERE id=?").run(row.id);
 importTeams(db,snapshot,'space-apps-seoul-2026');
 const after=db.prepare('SELECT * FROM teams WHERE external_id=?').get(row.external_id);
 assert.equal(after.id,row.id);assert.equal(after.recruitment_copy,'preserve');assert.equal(after.recruitment_status,'completed');
 assert.equal(db.prepare('SELECT COUNT(*) n FROM teams').get().n,32);db.close();
});
test('failed, partial, empty, duplicate and untrusted snapshots cannot be normalized',()=>{
 for(const altered of [{...raw,status:'error'},{...raw,collection:{...raw.collection,complete:false}},{...raw,teams:[]},{...raw,teams:[raw.teams[0],raw.teams[0],...raw.teams.slice(2)]},{...raw,source_url:'https://invalid.example/'}]) assert.throws(()=>normalizeSnapshot(altered));
 const missing=structuredClone(raw);delete missing.teams[0].seeking_members;assert.throws(()=>normalizeSnapshot(missing));
 const unknown=structuredClone(raw);unknown.teams[0].seeking_members=null;assert.equal(normalizeSnapshot(unknown).teams[0].seeking_members,null);
});
