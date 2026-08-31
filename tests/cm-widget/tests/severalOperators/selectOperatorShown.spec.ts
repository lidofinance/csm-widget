import { expect } from '@playwright/test';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES, SHORT_ROLES } from 'tests/shared/consts/roles';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.MULTI_OPERATOR.secretPhrase });

test.describe(
  'Wallet manages several Node Operators. Select modal (forked)',
  { tag: [Tags.forked] },
  () => {
    let managedIds: number[];

    const expectedBadges = [
      SHORT_ROLES[ROLES.REWARDS],
      SHORT_ROLES[ROLES.MANAGER],
    ];

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');

      managedIds = PRESETS.MULTI_OPERATOR.noIds ?? [];
      expect(
        managedIds.length,
        'MULTI_OPERATOR preset must own two operators',
      ).toBe(2);
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should list every managed operator', async ({ widgetService }) => {
      const modal = widgetService.selectOperatorModal;

      await test.step('The prompt explains why it is shown', async () => {
        await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
        await expect(modal.title).toBeVisible();
        await expect(modal.description).toContainText(
          'Your wallet manages several Node Operators. Choose the one to work with.',
        );
      });

      await test.step('Every managed operator has its own row', async () => {
        await expect(modal.rows).toHaveCount(managedIds.length);
        for (const noId of managedIds) {
          await expect(modal.rowById(noId)).toBeVisible();
        }
      });

      await test.step('Each row shows the roles the wallet holds', async () => {
        for (const noId of managedIds) {
          await expect(modal.roleBadgesById(noId)).toHaveText(expectedBadges);
        }
      });

      await test.step('Both role legends are shown', async () => {
        await expect(modal.legendManager).toContainText('Manager Address role');
        await expect(modal.legendRewards).toContainText('Rewards Address role');
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
      const modal = widgetService.selectOperatorModal;
      const closings: [string, () => Promise<void>][] = [
        ['the cross', () => modal.clickCross()],
        ['Escape', () => modal.pressEscape()],
        ['the backdrop', () => modal.clickBackdrop()],
      ];

      for (const [name, close] of closings) {
        await test.step(`Closing by ${name} disconnects the wallet`, async () => {
          await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
          await close();
          await expect(widgetService.header.connectWalletBtn).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(widgetService.header.accountSection).toBeHidden();
        });

        await test.step(`Reconnecting after ${name} asks again`, async () => {
          await widgetService.connectWallet({ keepOperatorPrompt: true });
          await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
        });
      }
    });

    test('Should ask again after a deliberate disconnect', async ({
      widgetService,
    }) => {
      const modal = widgetService.selectOperatorModal;

      await test.step('Pick the first operator', async () => {
        await modal.selectOperator(managedIds[0]);
        expect(await widgetService.extractNodeOperatorId()).toBe(managedIds[0]);
      });

      await test.step('Disconnecting forgets the pick', async () => {
        await widgetService.header.disconnectWallet();
        await widgetService.connectWallet({ keepOperatorPrompt: true });
        await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      });
    });
  },
);
