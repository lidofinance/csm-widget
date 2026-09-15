import { qase } from 'playwright-qase-reporter/playwright';
import { test } from './test.fixture';
import { EPIC, qaseTree } from 'tests/csm-widget/consts/qase.const';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe(
  ...qaseTree({
    epic: EPIC.landing,
    story: 'Connect wallet',
  }),
  async () => {
    test(
      qase(158, 'Should open main page after connect wallet'),
      async ({ widgetService }) => {
        await widgetService.page
          .getByText('CSM node operator starter pack')
          .waitFor({ state: 'visible' });
      },
    );
  },
);
