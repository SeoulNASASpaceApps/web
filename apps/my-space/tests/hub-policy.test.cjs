const test=require('node:test'),assert=require('node:assert/strict');
const policy=require('../hub-policy.js');
const base=()=>({starter:'a',recipient:'b',last_message_at:'2026-10-09T00:00:00Z',messages:[{sender:'a',text:'hello'}]});
test('five-day boundary expires unanswered threads and disables replies',()=>{
 const thread=base(),last=Date.parse(thread.last_message_at);
 assert.equal(policy.threadStatus(thread,last+policy.INACTIVITY_MS-1),'active');
 assert.equal(policy.replyPolicy(thread,'b',last+policy.INACTIVITY_MS-1).canReply,true);
 assert.equal(policy.threadStatus(thread,last+policy.INACTIVITY_MS),'expired');
 assert.equal(policy.replyPolicy(thread,'b',last+policy.INACTIVITY_MS).canReply,false);
 assert.equal(thread.messages.length,1);
});
test('a timely reply restarts five-day interval; completed/expired threads never revive',()=>{
 const thread=base(),last=Date.parse(thread.last_message_at),replyAt=last+4*86400000;
 thread.messages.push({sender:'b',text:'reply',at_iso:new Date(replyAt).toISOString()});thread.last_message_at=new Date(replyAt).toISOString();
 assert.equal(policy.threadStatus(thread,last+6*86400000),'active');
 assert.equal(policy.threadStatus(thread,replyAt+policy.INACTIVITY_MS),'expired');
 thread.status='expired';thread.last_message_at=new Date(replyAt+policy.INACTIVITY_MS).toISOString();assert.equal(policy.threadStatus(thread,replyAt+policy.INACTIVITY_MS+1),'expired');
 thread.status='completed';assert.equal(policy.replyPolicy(thread,'a',replyAt).canReply,false);
});
test('team contact is to owner using peer opt-in; contact scopes stay independent',()=>{
 const owner={emailOptIn:true,peerEmailOptIn:false};
 assert.equal(policy.canReceiveEmail(owner,'participant',true),false);
 assert.equal(policy.canReceiveEmail(owner,'owner',true),false);
 assert.equal(policy.canReceiveEmail(owner,'owner'),true);
 owner.peerEmailOptIn=true;owner.emailOptIn=false;
 assert.equal(policy.canReceiveEmail(owner,'participant',true),true);
 assert.equal(policy.canReceiveEmail(owner,'owner'),false);
 assert.equal(policy.canReceiveEmail(null,'participant',true),false);
});
