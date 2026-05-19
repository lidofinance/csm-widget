import { qase } from 'playwright-qase-reporter/playwright';
import { test } from './test.fixture';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Connect wallet', async () => {
  test(
    qase(158, 'Should open main page after connect wallet'),
    async ({ widgetService }) => {
      await widgetService.page
        .getByText('CSM node operator starter pack')
        .waitFor({ state: 'visible' });
    },
  );
});
