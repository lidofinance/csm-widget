import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { KeysPage } from 'tests/csm-widget/pages';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.keys,
    // spans Remove keys and View keys, so it belongs to the epic itself
    feature: null,
    story: 'Empty operator',
  }),
  async () => {
    let keysPage: KeysPage;

    test.beforeEach(async ({ widgetService }) => {
      keysPage = new KeysPage(widgetService.page);
    });

    test(
      qase(151, 'Remove page. Should present empty view for empty wallet'),
      async () => {
        await keysPage.removePage.open();
        await expect(keysPage.removePage.removeKeysForm).toContainText(
          'No keys available to remove',
        );
        await expect(keysPage.removePage.removeKeysForm).toContainText(
          'note: Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL).',
        );
        await expect(
          keysPage.removePage.removeKeysButton,
          'Expected that remove button wont be visible',
        ).toBeHidden();
      },
    );

    test.skip(
      qase(178, 'View keys page. Should present empty view for empty wallet'),
      async () => {
        // !!! SKIPPED, BECAUSE RPC NOT STABLE FOR THIS CASE, SEE TICKET - CS-762
        await keysPage.keysView.open();
        await keysPage.keysView.page
          .getByText('View keys list')
          .waitFor({ state: 'visible', timeout: PAGE_WAIT_TIMEOUT });
        await keysPage.keysView.loader.waitFor({ state: 'hidden' });
        await expect(keysPage.keysView.viewKeysBlock).toContainText(
          'There are no keys to display',
        );
        await expect(
          keysPage.keysView.table,
          'Expected that table with view keys wont be visible',
        ).toBeHidden();
      },
    );
  },
);
