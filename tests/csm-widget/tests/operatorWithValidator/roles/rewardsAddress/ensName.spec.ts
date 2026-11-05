import { trimAddress } from '@lidofinance/address';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { mockEns } from 'tests/shared/helpers/mockEns';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

// Emulated names: the raw mixed-case name is a different ENS node, so it can
// hold another address. Only the normalized lookup may reach OWNER_ADDRESS.
const ENS_NAME = 'ensnametest.eth';
const OWNER_ADDRESS = generateAddress(true);
const SQUATTER_ADDRESS = generateAddress(true);

// Real mainnet record, used for reverse resolution
const VITALIK_NAME = 'vitalik.eth';
const VITALIK_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

const INVALID_ERROR = 'Specify a valid address or ENS name';

test.describe(
  ...suite({
    epic: EPIC.roles,
    feature: 'Rewards address',
    story: 'ENS name',
  }),
  () => {
    let snapshotId: string;
    let unmockEns: () => Promise<void>;

    test.beforeAll(async ({ evmNode, widgetService }) => {
      snapshotId = await evmNode.snapshot();
      await test.step('Mock ENS names', async () => {
        unmockEns = await mockEns(widgetService.page, {
          [ENS_NAME]: OWNER_ADDRESS,
          'Ensnametest.eth': SQUATTER_ADDRESS,
        });
      });
    });

    test.afterAll(async ({ evmNode }) => {
      await unmockEns?.();
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.settingsPage.rewardsAddressPage.open();
    });

    (
      [
        [641, ENS_NAME],
        [642, 'Ensnametest.eth'],
        [643, 'ENSNAMETEST.eth'],
        [644, 'ENSNAMETEST.ETH'],
      ] as const
    ).forEach(([id, name]) => {
      test(
        qase(id, `Should resolve "${name}" to the normalized name's address`),
        async ({ widgetService }) => {
          const page = widgetService.settingsPage.rewardsAddressPage;

          await page.addressInput.fill(name);

          await test.step('Input keeps the typed name', async () => {
            await expect(page.addressInput).toHaveValue(name);
          });

          await test.step('Label shows the normalized name address', async () => {
            await expect(page.inputLabel).toContainText(OWNER_ADDRESS);
            await expect(page.form.getByText(INVALID_ERROR)).toBeHidden();
          });

          await test.step('Propose button is enabled', async () => {
            await expect(page.proposeButton).toBeEnabled();
          });
        },
      );
    });

    (
      [
        [645, 'ensnametest@.eth'],
        [646, 'unregistered-name-csm-e2e-404.eth'],
      ] as const
    ).forEach(([id, name]) => {
      test(qase(id, `Should reject "${name}"`), async ({ widgetService }) => {
        const page = widgetService.settingsPage.rewardsAddressPage;

        await page.addressInput.fill(name);

        await test.step('Validation error is shown', async () => {
          await expect(page.validationInputTooltip).toContainText(
            INVALID_ERROR,
          );
        });

        await test.step('No address is resolved', async () => {
          await expect(page.inputLabel).not.toContainText('0x');
        });
      });
    });

    test(
      qase(647, 'Should show the ENS name for a raw address'),
      async ({ widgetService }) => {
        const page = widgetService.settingsPage.rewardsAddressPage;

        await page.addressInput.fill(VITALIK_ADDRESS);

        await test.step('Reverse-resolved name is shown in the label', async () => {
          await expect(page.inputLabel).toContainText(VITALIK_NAME);
        });

        await test.step('Propose button is enabled', async () => {
          await expect(page.proposeButton).toBeEnabled();
        });
      },
    );

    test(
      qase(648, 'Should propose the normalized name address'),
      async ({ widgetService, csmSDK, forkActionService }) => {
        const page = widgetService.settingsPage.rewardsAddressPage;
        const noId = await widgetService.extractNodeOperatorId();
        if (await csmSDK.isPendingRole(noId, 'rewards')) {
          await page.revokePendingRole();
        }

        await page.proposeNewAddress('Ensnametest.eth');

        await test.step('Pending address is the normalized name one', async () => {
          await expect(page.pendingAddress).toContainText(
            trimAddress(OWNER_ADDRESS, 6),
          );
          expect(await forkActionService.getProposedRewardAddress(noId)).toBe(
            OWNER_ADDRESS,
          );
        });
      },
    );
  },
);
