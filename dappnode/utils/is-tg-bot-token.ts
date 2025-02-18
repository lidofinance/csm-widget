export default function isTelegramBotToken(token: string): boolean {
  const telegramBotTokenPattern = /^\d{7,10}:[a-zA-Z0-9_-]{35}$/;
  return telegramBotTokenPattern.test(token);
}
