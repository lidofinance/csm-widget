import { test } from './test.fixture';

test.describe('First test suite', async () => {
  test('First test case', async ({ widgetService }) => {
    await widgetService.page.goto('/');
    await widgetService.connectWallet();
  });
});
