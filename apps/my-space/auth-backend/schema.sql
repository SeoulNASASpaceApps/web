PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS participants (
 id TEXT PRIMARY KEY,event_id TEXT NOT NULL,nasa_email TEXT NOT NULL,name TEXT NOT NULL,
 official_confirmed INTEGER NOT NULL DEFAULT 0,seoul_confirmed INTEGER NOT NULL DEFAULT 0,
 guardian_status TEXT NOT NULL DEFAULT 'pending',eligible INTEGER NOT NULL DEFAULT 0,
 approval_status TEXT NOT NULL DEFAULT 'pending', updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS participant_email ON participants(event_id,nasa_email);
CREATE TABLE IF NOT EXISTS identities (
 id TEXT PRIMARY KEY,provider TEXT NOT NULL,provider_user_id TEXT NOT NULL,email TEXT,
 email_verified INTEGER NOT NULL DEFAULT 0,participant_id TEXT REFERENCES participants(id),
 UNIQUE(provider,provider_user_id),UNIQUE(participant_id)
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,identity_id TEXT NOT NULL REFERENCES identities(id),csrf TEXT NOT NULL,expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS oauth_states (
 state_hash TEXT PRIMARY KEY,provider TEXT NOT NULL,verifier TEXT NOT NULL,return_to TEXT NOT NULL,expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS approval_requests (
 id TEXT PRIMARY KEY,identity_id TEXT NOT NULL REFERENCES identities(id),event_id TEXT NOT NULL,email TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',version INTEGER NOT NULL DEFAULT 1,created_at INTEGER NOT NULL,
 reviewed_at INTEGER,reviewed_by TEXT,reason TEXT,UNIQUE(identity_id,event_id)
);
CREATE TABLE IF NOT EXISTS verifications (
 id TEXT PRIMARY KEY,request_id TEXT NOT NULL REFERENCES approval_requests(id),identity_id TEXT NOT NULL REFERENCES identities(id),
 email TEXT NOT NULL,request_version INTEGER NOT NULL,token_hash TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,verified_at INTEGER,
 send_status TEXT NOT NULL DEFAULT 'reserved',message_id TEXT
);
CREATE TABLE IF NOT EXISTS approval_audit (
 id TEXT PRIMARY KEY,request_id TEXT NOT NULL,operator_id TEXT NOT NULL,decision TEXT NOT NULL,created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
 participant_id TEXT PRIMARY KEY REFERENCES participants(id),seeking_status TEXT NOT NULL DEFAULT 'seeking',
 owner_email_opt_in INTEGER NOT NULL DEFAULT 0,peer_email_opt_in INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS teams (
 id TEXT PRIMARY KEY,event_id TEXT NOT NULL,external_id TEXT NOT NULL,official_url TEXT NOT NULL,name TEXT NOT NULL,
 challenge TEXT,official_seeking INTEGER,last_seen_at TEXT NOT NULL,
 owner_participant_id TEXT REFERENCES participants(id),recruitment_status TEXT NOT NULL DEFAULT 'paused',
 recruitment_copy TEXT NOT NULL DEFAULT '',recruitment_roles TEXT NOT NULL DEFAULT '[]',UNIQUE(event_id,external_id)
);
