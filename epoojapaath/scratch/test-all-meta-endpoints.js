const pixelId = '1347524480826624';
const token = 'EAATKZBbOnHPQBSFAhNRw9Q8R1mQEkWz9nDFrYdZAjMjEfYA5ImZCVQZBw3hOZBJPW7P6cZAXjGWXii7lmSWoBhx9hb0ZAUW8sSOi0P6BfeADBwJIUDCOPCJZChxPdaZCBf0m8qDQk0XWZCNzZBeZCJhNlqVhI09DcjZBBJk2ZBanWt9IpxFLSh36qa3KvgYPTSBG97B1wEXgZDZD';
const adAccountId = '2071499050357230';

async function testAll() {
  console.log('Testing Meta Token permissions and endpoints...');

  const endpoints = [
    { name: 'me', url: `https://graph.facebook.com/v19.0/me?access_token=${token}` },
    { name: 'me/adaccounts', url: `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${token}` },
    { name: 'pixel basic', url: `https://graph.facebook.com/v19.0/${pixelId}?access_token=${token}` },
    { name: 'pixel stats default', url: `https://graph.facebook.com/v19.0/${pixelId}/stats?access_token=${token}` },
    { name: 'pixel stats aggregation=event', url: `https://graph.facebook.com/v19.0/${pixelId}/stats?aggregation=event&access_token=${token}` },
    { name: 'pixel stats last 30d', url: `https://graph.facebook.com/v19.0/${pixelId}/stats?start_time=1700000000&access_token=${token}` },
    { name: 'adaccount basic', url: `https://graph.facebook.com/v19.0/act_${adAccountId}?access_token=${token}` },
    { name: 'adaccount insights preset=last_30d', url: `https://graph.facebook.com/v19.0/act_${adAccountId}/insights?date_preset=last_30d&access_token=${token}` },
    { name: 'adaccount insights preset=maximum', url: `https://graph.facebook.com/v19.0/act_${adAccountId}/insights?fields=spend,impressions,clicks,actions&date_preset=maximum&access_token=${token}` },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const data = await res.json();
      console.log(`\n=== ${ep.name} [Status: ${res.status}] ===`);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error on ${ep.name}:`, e.message);
    }
  }
}

testAll();
