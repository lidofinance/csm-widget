export default function isTelegramUserID(id: string): boolean {
  const telegramUserIDPattern = /^\d+$/;
  return telegramUserIDPattern.test(id);
}
