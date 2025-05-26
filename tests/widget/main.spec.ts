import { test } from './test.fixture';
import { qase } from 'playwright-qase-reporter';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Main page', async () => {
  test(
    qase(158, 'Should open keys page after click to "Create Node Operator"'),
    async ({ widgetService }) => {
      await widgetService.connectWallet();
      await widgetService.page
        .getByText('CSM node operator starter pack')
        .waitFor({ state: 'visible' });
      await widgetService.page.getByText('Create Node Operator').click();

      await widgetService.page
        .getByText('Choose bond token')
        .waitFor({ state: 'visible' });
    },
  );
});
