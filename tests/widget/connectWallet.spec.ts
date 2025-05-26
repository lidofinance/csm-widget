import { test } from './test.fixture';

test.describe('Connect wallet', async () => {
  test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

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
