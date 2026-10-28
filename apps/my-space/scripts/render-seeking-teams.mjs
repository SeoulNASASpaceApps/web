import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const challengeIds = new Map([
  ["Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars", 'abandoned'],
  ['Be An Earth System Trend Detective!', 'earth-trend'],
  ['Build a Junior Astronaut Mission Trainer', 'junior-astronaut'],
  ['Lunar Landing Site Navigator', 'clps-browser'],
  ['Create Health Monitoring Software for Astronauts on Space Missions', 'astronaut-health'],
  ['Dancing with the SARs', 'dancing-sars'],
  ['Field Shift: Adapting Farms with NASA Data', 'field-shift'],
  ['Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data', 'flame-freefall'],
  ['Harmonization of MODIS and VIIRS Hot Spots', 'fire-hotspots'],
  ['Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars', 'earth-analogs'],
  ['Interplanetary Survival Guide: Martian Map', 'martian-map'],
  ['Planet X and SPHEREx', 'planet-x'],
  ['Space Mission Design Game', 'mission-design-game'],
  ['The Earth Information Jukebox', 'earth-jukebox']
]);

export function renderSeekingTeams(snapshot) {
  if (!snapshot || snapshot.status !== 'success' || snapshot.collection?.complete !== true) {
    throw new Error('A complete successful official snapshot is required.');
  }
  if (!Array.isArray(snapshot.teams) || snapshot.teams.length !== snapshot.collection.expected_total) {
    throw new Error('Snapshot team counts do not match.');
  }
  const seen = new Set();
  const teams = snapshot.teams.filter(team => team.seeking_members === true).map(team => {
    const url = new URL(team.official_team_url);
    const id = url.pathname.split('/').filter(Boolean).at(-1);
    const challengeId = challengeIds.get(team.challenge);
    if (!id || seen.has(id) || !challengeId || url.origin !== 'https://www.spaceappschallenge.org') {
      throw new Error('Unexpected or duplicate official team data.');
    }
    seen.add(id);
    return {id, name: team.team_name, challengeId, roles: [], skills: [], url: url.href, seeking: true};
  });
  const latest = Math.max(...snapshot.teams.map(team => Date.parse(team.retrieved_at)));
  const syncedAt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date(latest)).replace(/-/g, '.').replace(',', '') + ' KST';
  return `window.SEOUL_SEEKING_TEAMS_SYNC = ${JSON.stringify({syncedAt, sourceUrl: snapshot.source_url, teams}, null, 2)};\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error('Usage: render-seeking-teams snapshot.json output.js');
  writeFileSync(output, renderSeekingTeams(JSON.parse(readFileSync(input, 'utf8'))), 'utf8');
}
