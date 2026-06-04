import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe('Group page. Operator card.', { tag: [Tags.forked] }, () => {
  let noId: number;
  const companionId = 1;

  test.beforeAll(({ useFork }) => {
    test.skip(!useFork, 'Test suite runs only on forked network');
  });

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
    noId = await widgetService.extractNodeOperatorId();
    await widgetService.groupPage.open();
  });

  test.describe('Header', () => {
    test(
      qase(219, 'Should display correct weight chips for both operators'),
      async ({ widgetService }) => {
        const { groupPage } = widgetService;

        await test.step('Operator #0 weight chip', async () => {
          const op0 = groupPage.operator(noId);
          await expect(op0.weight).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
          await expect(op0.weight).toContainText('Weight:');
          await expect(op0.weight).toContainText(/\d+(\.\d+)?/);
        });

        await test.step('Operator #1 weight chip', async () => {
          const op1 = groupPage.operator(companionId);
          await expect(op1.weight).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
          await expect(op1.weight).toContainText('Weight:');
          await expect(op1.weight).toContainText(/\d+(\.\d+)?/);
        });
      },
    );

    test(
      qase(
        220,
        'Should display operator name and curve type for both operators',
      ),
      async ({ widgetService }) => {
        const { groupPage } = widgetService;

        for (const id of [noId, companionId]) {
          const op = groupPage.operator(id);

          await test.step(`Operator #${id} metadata name is visible`, async () => {
            await expect(op.metadataName).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
          });

          await test.step(`Operator #${id} curve name is visible`, async () => {
            await expect(op.curveName).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
          });
        }
      },
    );

    test(
      qase(
        221,
        'Should display "Rewards:" and "Manager:" address labels for both operators',
      ),
      async ({ widgetService }) => {
        const { groupPage } = widgetService;

        for (const id of [noId, companionId]) {
          const op = groupPage.operator(id);

          await test.step(`Operator #${id} rewards address label`, async () => {
            await expect(op.rewardsAddress).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
            await expect(op.rewardsAddress).toContainText('Rewards:');
          });

          await test.step(`Operator #${id} manager address label`, async () => {
            await expect(op.managerAddress).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
            await expect(op.managerAddress).toContainText('Manager:');
          });
        }
      },
    );
  });

  test.describe('Stake stats', () => {
    test(
      qase(
        222,
        'Should display all three stake columns with labels in each card',
      ),
      async ({ widgetService }) => {
        const { groupPage } = widgetService;

        for (const id of [noId, companionId]) {
          const op = groupPage.operator(id);

          await test.step(`Operator #${id} — "Active" column`, async () => {
            await expect(op.stakeColumnActive).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
            await expect(op.stakeColumnActive).toContainText('Active');
          });

          await test.step(`Operator #${id} — "Depositable" column`, async () => {
            await expect(op.stakeColumnDepositable).toBeVisible();
            await expect(op.stakeColumnDepositable).toContainText(
              'Depositable',
            );
          });

          await test.step(`Operator #${id} — "Potential additional capacity" column`, async () => {
            await expect(op.stakeColumnPotential).toBeVisible();
            await expect(op.stakeColumnPotential).toContainText(
              'Potential additional capacity',
            );
          });
        }
      },
    );

    test(
      qase(223, 'Should show key counts in active and depositable columns'),
      async ({ widgetService }) => {
        const op0 = widgetService.groupPage.operator(noId);

        await test.step('Active keys count contains "key"', async () => {
          await expect(op0.stakeColumnActiveKeys).toBeVisible({
            timeout: STAGE_WAIT_TIMEOUT,
          });
          await expect(op0.stakeColumnActiveKeys).toContainText('key');
        });

        await test.step('Depositable keys count contains "key"', async () => {
          await expect(op0.stakeColumnDepositableKeys).toBeVisible();
          await expect(op0.stakeColumnDepositableKeys).toContainText('key');
        });
      },
    );

    test(
      qase(224, 'Should show correct tooltips on stake columns'),
      async ({ widgetService }) => {
        const op0 = widgetService.groupPage.operator(noId);

        await test.step('"Active" column tooltip', async () => {
          await op0.stakeColumnActiveTooltip.hover();
          await expect(op0.tooltipWrapper).toHaveCount(1);
          await expect(op0.tooltipWrapper).toContainText(
            'The amount of ETH currently staked by the Lido protocol with this Node Operator',
          );
        });

        await test.step('"Depositable" column tooltip', async () => {
          await op0.stakeColumnDepositableTooltip.hover();
          await expect(op0.tooltipWrapper).toHaveCount(1);
          await expect(op0.tooltipWrapper).toContainText(
            'Available capacity ready to receive stake from the Lido protocol',
          );
        });

        await test.step('"Potential additional capacity" column tooltip', async () => {
          await op0.stakeColumnPotentialTooltip.hover();
          await expect(op0.tooltipWrapper).toHaveCount(1);
          await expect(op0.tooltipWrapper).toContainText(
            'The additional stake the Lido protocol could allocate to this Node Operator based on its current weight, assuming enough validator keys are available.',
          );
        });
      },
    );
  });

  test.describe('Keys status chip', () => {
    test(
      qase(225, 'Should show keys status chip for both operators'),
      async ({ widgetService }) => {
        const { groupPage } = widgetService;

        for (const id of [noId, companionId]) {
          await test.step(`Operator #${id} keys chip is visible`, async () => {
            await expect(groupPage.operator(id).keysChip).toBeVisible({
              timeout: STAGE_WAIT_TIMEOUT,
            });
          });
        }
      },
    );

    test(
      qase(
        226,
        'Should show "Enough keys" chip for operator with sufficient keys',
      ),
      async ({ widgetService }) => {
        const op0 = widgetService.groupPage.operator(noId);

        await expect(op0.keysChip).toContainText('Enough keys', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
      },
    );
  });

  test.describe('Action buttons', () => {
    test(
      qase(227, 'Should show "Upload keys" link for the current operator'),
      async ({ widgetService }) => {
        const op0 = widgetService.groupPage.operator(noId);

        await expect(op0.uploadKeysLink).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await expect(op0.uploadKeysLink).toContainText('Upload keys');
      },
    );

    test(
      qase(
        228,
        'Should show disabled message for operator managed by a different wallet',
      ),
      async ({ widgetService }) => {
        const op1 = widgetService.groupPage.operator(companionId);

        await expect(op1.differentWalletMessage).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await expect(op1.differentWalletMessage).toContainText(
          'This Node Operator is managed by a different wallet. Switch wallets to upload keys.',
        );
        await expect(op1.differentWalletMessage).toBeDisabled();
      },
    );
  });
});
