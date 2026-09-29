import { test } from './test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_ADDRESS.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.landing,
    story: 'Main page',
  }),
  async () => {
    test(
      qase(5, 'Should open keys page after click to "Create Node Operator"'),
      async ({ widgetService }) => {
        await widgetService.page
          .getByText('CSM node operator starter pack')
          .waitFor({ state: 'visible' });
        await widgetService.mainPage.openCreateForm();

        await widgetService.page
          .getByText('Choose bond token')
          .waitFor({ state: 'visible' });
      },
    );
  },
);
