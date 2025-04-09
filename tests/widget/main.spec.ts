import { test } from './test.fixture';

test.describe('Main page', async () => {
  test('Should open keys tab after click to "Create Node Operator"', async ({
    widgetService,
  }) => {
    await widgetService.page.goto('/');
    await widgetService.connectWallet();
    await widgetService.page
      .getByText('CSM node operator starter pack')
      .waitFor({ state: 'visible' });
    await widgetService.page.getByText('Create Node Operator').click();

    await widgetService.page
      .getByText('Choose bond token')
      .waitFor({ state: 'visible' });
  });
});
