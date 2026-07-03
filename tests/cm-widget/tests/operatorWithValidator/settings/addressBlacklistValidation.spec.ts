import { expect } from '@playwright/test';
import { OFAC_MODAL_TEXT } from 'tests/shared/consts/texts.const';
import { LOW_TIMEOUT } from 'tests/shared/consts/timeouts';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { TxModal } from 'tests/cm-widget/pages/elements/common/element.txProgressModal';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

test.describe('Settings. Address blacklist validation', () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    txModal = new TxModal(widgetService.page);

    await test.step('Mock blacklisted wallet address', async () => {
      await widgetService.mockValidationAddressRequest();
    });
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.page.unrouteAll();
  });

  test('Should show access denied modal when Metadata is saved', async ({
    widgetService,
  }) => {
    const { metadataPage } = widgetService.settingsPage;

    await test.step('Open Metadata settings page', async () => {
      await metadataPage.open();
    });

    await test.step('Change name and click Save', async () => {
      const uid = crypto.randomUUID().slice(0, 8);
      await metadataPage.nameInput.fill(`Blacklisted ${uid}`);
      await expect(metadataPage.saveButton).toBeEnabled();
      await metadataPage.saveButton.click();
    });

    await test.step('Access denied modal is shown', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should show access denied modal when Rewards claimer is set', async ({
    widgetService,
  }) => {
    const { claimerPage } = widgetService.settingsPage;

    await test.step('Open Rewards claimer settings page', async () => {
      await claimerPage.open();
    });

    await test.step('Set new Rewards claimer address', async () => {
      await claimerPage.setAddress(VALID_ADDRESS);
    });

    await test.step('Access denied modal is shown', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should show access denied modal when Splits are saved', async ({
    widgetService,
  }) => {
    const { splitsPage } = widgetService.settingsPage;

    await test.step('Open Splits settings page', async () => {
      await splitsPage.open();
    });

    await test.step('Add a split and submit', async () => {
      await splitsPage.clickSetupSplits();
      await splitsPage.addSplit(0, {
        address: generateAddress(),
        share: '50',
      });
      // share is stored as bigint and totalShare is recomputed in an async
      // effect — wait so the submit passes client-side validation
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await expect(splitsPage.saveSplitsButton).toBeEnabled();
      await splitsPage.saveSplitsButton.click();
    });

    await test.step('Access denied modal is shown', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should show access denied modal when manager address is proposed', async ({
    widgetService,
  }) => {
    const { managerAddressPage } = widgetService.settingsPage;

    await test.step('Open Manager Address tab', async () => {
      await managerAddressPage.open();
    });

    await test.step('Fill a new manager address and submit', async () => {
      await managerAddressPage.addressInput.fill(generateAddress());
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await managerAddressPage.addressValidIcon.waitFor({
        state: 'visible',
      });
      // submit button label varies by flow (Propose/Change) — target by type
      await managerAddressPage.form.locator('button[type="submit"]').click();
    });

    await test.step('Access denied modal is shown', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should show access denied modal when rewards address is proposed', async ({
    widgetService,
  }) => {
    const { rewardsAddressPage } = widgetService.settingsPage;

    await test.step('Open Rewards Address tab', async () => {
      await rewardsAddressPage.open();
    });

    await test.step('Fill a new rewards address and submit', async () => {
      await rewardsAddressPage.addressInput.fill(generateAddress());
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await rewardsAddressPage.addressValidIcon.waitFor({
        state: 'visible',
      });
      // submit button label varies by flow (Propose/Change) — target by type
      await rewardsAddressPage.form.locator('button[type="submit"]').click();
    });

    await test.step('Access denied modal is shown', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });
});
