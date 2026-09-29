import { qase } from 'playwright-qase-reporter/playwright';
import { test } from './test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_ADDRESS.secretPhrase });

test.describe(
  ...suite({
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
