(function (root, factory) {
  const policy = factory();
  if (typeof module === 'object' && module.exports) module.exports = policy;
  else root.SEOUL_HUB_POLICY = policy;
})(globalThis, () => {
  'use strict';
  const LIMITS = Object.freeze({starterMessages:3,recipientMessages:2,messagesPerThread:5,threadsPerPair:3,messageCharacters:50,inactivityDays:5});
  const INACTIVITY_MS = LIMITS.inactivityDays * 24 * 60 * 60 * 1000;
  const timestamp = value => typeof value === 'number' ? value : Date.parse(value);
  function threadStatus(thread, now = Date.now()) {
    if (['expired','completed'].includes(thread.status)) return thread.status;
    if (thread.messages.length >= LIMITS.messagesPerThread) return 'completed';
    const last = timestamp(thread.last_message_at || thread.messages.at(-1)?.at_iso || thread.created_at);
    return Number.isFinite(last) && now >= last + INACTIVITY_MS ? 'expired' : 'active';
  }
  function replyPolicy(thread, viewer, now = Date.now()) {
    const party = viewer === thread.starter ? 'starter' : viewer === thread.recipient ? 'recipient' : null;
    const limit = party === 'starter' ? LIMITS.starterMessages : LIMITS.recipientMessages;
    const used = thread.messages.filter(message => message.sender === viewer).length;
    const remaining = Math.max(0,limit-used),next = thread.messages.length % 2 === 0 ? thread.starter : thread.recipient;
    const status=threadStatus(thread,now);
    return {party,limit,used,remaining,status,canReply:!!party && remaining>0 && status==='active' && next===viewer};
  }
  function canReceiveEmail(profile,senderRole,toTeam=false) {
    if (!profile) return false;
    return toTeam || senderRole !== 'owner' ? profile.peerEmailOptIn === true : profile.emailOptIn === true;
  }
  return Object.freeze({LIMITS,INACTIVITY_MS,threadStatus,replyPolicy,canReceiveEmail});
});
