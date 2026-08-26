const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1347524480826624';
const token = process.env.META_ACCESS_TOKEN || 'EAATKZBbOnHPQBSFAhNRw9Q8R1mQEkWz9nDFrYdZAjMjEfYA5ImZCVQZBw3hOZBJPW7P6cZAXjGWXii7lmSWoBhx9hb0ZAUW8sSOi0P6BfeADBwJIUDCOPCJZChxPdaZCBf0m8qDQk0XWZCNzZBeZCJhNlqVhI09DcjZBBJk2ZBanWt9IpxFLSh36qa3KvgYPTSBG97B1wEXgZDZD';
const adAccountId = process.env.META_AD_ACCOUNT_ID || '2071499050357230';

async function test() {
  console.log('--- Testing Meta APIs ---');

  // 1. Pixel stats
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/stats?access_token=${token}`);
    console.log('1. /pixel/stats status:', res.status);
    const json = await res.json();
    console.log('1. /pixel/stats result:', JSON.stringify(json, null, 2));
  } catch (e) { console.error('1 error:', e); }

  // 2. Pixel details & event stats
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}?fields=name,last_fired_time,stats_by_event&access_token=${token}`);
    console.log('2. /pixel fields status:', res.status);
    const json = await res.json();
    console.log('2. /pixel fields result:', JSON.stringify(json, null, 2));
  } catch (e) { console.error('2 error:', e); }

  // 3. Pixel event_stats endpoint
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/event_stats?access_token=${token}`);
    console.log('3. /pixel/event_stats status:', res.status);
    const json = await res.json();
    console.log('3. /pixel/event_stats result:', JSON.stringify(json, null, 2));
  } catch (e) { console.error('3 error:', e); }

  // 4. Ad Account Insights with actions
  const cleanId = adAccountId.startsWith("act_") ? adAccountId : `act_${adAccountId}`;
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${cleanId}/insights?fields=spend,impressions,clicks,actions,reach&date_preset=maximum&access_token=${token}`);
    console.log('4. Ad Account Insights status:', res.status);
    const json = await res.json();
    console.log('4. Ad Account Insights result:', JSON.stringify(json, null, 2));
  } catch (e) { console.error('4 error:', e); }
}

test();
