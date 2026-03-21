const EXPO_PUSH_URL = 'https://exp.host/--/exponent-push-notifications/v2/push/send';

export async function sendPushNotification(tokens, title, body, data = {}) {
  const tokenList = Array.isArray(tokens) ? tokens : [tokens];
  const validTokens = tokenList.filter(t => t && typeof t === 'string' && t.startsWith('ExponentPushToken['));
  if (validTokens.length === 0) return;
  const messages = validTokens.map(token => ({ to: token, sound: 'default', title, body, data }));
  try {
    await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
  } catch (err) {
    console.error('[expo-push] Failed:', err);
  }
}
