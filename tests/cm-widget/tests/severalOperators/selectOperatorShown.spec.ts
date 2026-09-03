import { expect } from '@playwright/test';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES, SHORT_ROLES } from 'tests/shared/consts/roles';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Wallet manages several Node Operators. Select modal.',
  { tag: [Tags.forked] },
  () => {
    const managedIds = PRESETS.FULL_OPERATOR.noIds;

    const expectedBadges = [
      SHORT_ROLES[ROLES.REWARDS],
      SHORT_ROLES[ROLES.MANAGER],
    ];

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
      await widgetService.selectOperatorModal.selectOperatorIfModalShown();
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should list every managed operator', async ({ widgetService }) => {
      const selectModal = widgetService.selectOperatorModal;

      await test.step('The prompt explains why it is shown', async () => {
        await expect(selectModal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(selectModal.title).toBeVisible();
        await expect(selectModal.description).toContainText(
          'Your wallet manages several Node Operators. Choose the one to work with.',
        );
      });

      await test.step('Every managed operator has its own row', async () => {
        await expect(selectModal.rows).toHaveCount(managedIds.length);
        for (const noId of managedIds) {
          await expect(selectModal.rowById(noId)).toBeVisible();
        }
      });

      await test.step('Each row shows the roles the wallet holds', async () => {
        for (const noId of managedIds) {
          await expect(selectModal.roleBadgesById(noId)).toHaveText(
            expectedBadges,
          );
        }
      });

      await test.step('Both role legends are shown', async () => {
        await expect(selectModal.legendManager).toContainText(
          'Manager Address role',
        );
        await expect(selectModal.legendRewards).toContainText(
          'Rewards Address role',
        );
      });

      await test.step('The app shell stays hidden behind the prompt', async () => {
        await expect(widgetService.header.accountSection).toBeHidden();
        await expect(widgetService.header.switchOperatorButton).toBeHidden();
      });
    });

    test('Should activate the clicked operator', async ({ widgetService }) => {
      const target = managedIds[1];

      await test.step('Pick the second operator in the list', async () => {
        await widgetService.selectOperatorModal.selectOperator(target);
        expect(await widgetService.extractNodeOperatorId()).toBe(target);
      });

      await test.step('The pick survives a reload', async () => {
        await widgetService.page.reload();
        await expect(widgetService.header.switchOperatorButton).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(widgetService.selectOperatorModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(target);
      });
    });

    test('Should disconnect when the prompt is closed', async ({
      widgetService,
    }) => {
      const selectModal = widgetService.selectOperatorModal;
      const closings: [string, () => Promise<void>][] = [
        ['the cross', () => selectModal.clickCross()],
        ['Escape', () => selectModal.pressEscape()],
        ['the backdrop', () => selectModal.clickBackdrop()],
      ];

      for (const [name, close] of closings) {
        await test.step(`Closing by ${name} disconnects the wallet`, async () => {
          await expect(selectModal.modal).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await close();
          await expect(widgetService.header.connectWalletBtn).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(widgetService.header.accountSection).toBeHidden();
        });

        await test.step(`Reconnecting after ${name} asks again`, async () => {
          await widgetService.connectWalletWithoutSelectingOperator();
          await expect(selectModal.modal).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });
      }
    });

    test('Should ask again after a deliberate disconnect', async ({
      widgetService,
    }) => {
      const selectModal = widgetService.selectOperatorModal;

      await test.step('Pick the first operator', async () => {
        await selectModal.selectOperator(managedIds[0]);
        expect(await widgetService.extractNodeOperatorId()).toBe(managedIds[0]);
      });

      await test.step('Disconnecting forgets the pick', async () => {
        await widgetService.header.disconnectWallet();
        await widgetService.connectWalletWithoutSelectingOperator();
        await expect(selectModal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });
    });
  },
);
