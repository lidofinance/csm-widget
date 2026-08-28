import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.describe(
  'Roles. Manager Address. Reset manager address.',
  {
    tag: [Tags.forked],
  },
  () => {
    let snapshotId: string;
    let proposedAddress: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ widgetService, csmSDK, forkActionService }) => {
      snapshotId = await csmSDK.evmSnapshot();
      await widgetService.settingsPage.managerAddressPage.open();
      const nodeOperatorId = await widgetService.extractNodeOperatorId();

      proposedAddress = generateAddress();
      await forkActionService.proposeManager(nodeOperatorId, proposedAddress);
      await forkActionService.confirmManager(nodeOperatorId);
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should reset manager address when proposed', async ({
      widgetService,
    }) => {
      test.fail(true, 'issue - CS-1205');
      await widgetService.settingsPage.managerAddressPage.open();
      await expect(
        widgetService.settingsPage.managerAddressPage.resetButton,
      ).toBeEnabled();
      await widgetService.settingsPage.managerAddressPage.resetButton.click();

      await test.step('Waiting for modal with confirmation tx', async () => {
        await expect(
          widgetService.page.getByText('You are changing Manager Address'),
        ).toBeVisible({ timeout: RPC_WAIT_TIMEOUT });
      });

      await widgetService.walletPage.confirmTx();

      await test.step('Waiting for success message', async () => {
        await expect(
          widgetService.page.getByText('Manager Address has been changed'),
        ).toBeVisible({ timeout: RPC_WAIT_TIMEOUT });
      });

      await widgetService.settingsPage.txModal.closeModal();
      await expect(
        widgetService.settingsPage.managerAddressPage.addressInput,
      ).toHaveValue('');
    });
  },
);
