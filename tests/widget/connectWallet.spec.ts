import { test } from './test.fixture';

test.describe('Connect wallet', async () => {
  test('Should open main page after connect wallet', async ({
    widgetService,
  }) => {
    await widgetService.page.goto('/');
    await widgetService.connectWallet();
    await widgetService.page
      .getByText('CSM node operator starter pack')
      .waitFor({ state: 'visible' });
  });
});
