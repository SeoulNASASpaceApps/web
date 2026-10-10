import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const source='https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams';
const validDate=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
export function normalizeSnapshot(raw) {
  if(raw.status!=='success'||raw.collection?.complete!==true||raw.source_url!==source) throw new Error('Only complete, successful Seoul snapshots are accepted.');
  const rows=raw.teams;
  if(!Array.isArray(rows)||!rows.length||rows.length!==raw.collection.expected_total||rows.length!==raw.collection.collected_total) throw new Error('Nonempty, complete counts are required.');
  const ids=new Set(),urls=new Set();
  const teams=rows.map(row=>{
    const url=new URL(row.official_team_url);
    if(url.origin!=='https://www.spaceappschallenge.org'||!/^\/2026\/find-a-team\/[^/]+\/$/.test(url.pathname)||url.search||url.hash) throw new Error('Unexpected team URL.');
    if(typeof row.official_team_id!=='string'||!row.official_team_id||ids.has(row.official_team_id)||urls.has(url.href)) throw new Error('Missing or duplicate team identity.');
    if(typeof row.team_name!=='string'||!row.team_name.trim()||!validDate(row.retrieved_at)||row.source_url!==source) throw new Error('Missing team evidence.');
    if(row.seeking_members!==null&&typeof row.seeking_members!=='boolean') throw new Error('Invalid recruitment flag.');
    if(row.challenge!==null&&typeof row.challenge!=='string') throw new Error('Invalid challenge.');
    ids.add(row.official_team_id);urls.add(url.href);
    return {external_id:row.official_team_id,official_url:url.href,name:row.team_name,challenge:row.challenge,seeking_members:row.seeking_members};
  });
  const times=rows.map(row=>Date.parse(row.retrieved_at));
  return {source_url:source,collected_at:new Date(Math.max(...times)).toISOString(),teams};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  try {
    const [input,output]=process.argv.slice(2);
    if(!input||!output||resolve(input)===resolve(output)) throw new Error('Use distinct input and output paths.');
    const normalized=normalizeSnapshot(JSON.parse(readFileSync(input,'utf8')));
    const temporary=`${output}.tmp`;
    writeFileSync(temporary,JSON.stringify(normalized,null,2)+'\n',{mode:0o600});renameSync(temporary,output);
    console.log(JSON.stringify({validated:true,teams:normalized.teams.length,output}));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
