import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import {
  buildDvtStatusResponse,
  dvtApplicationStatus,
} from 'tests/shared/services/mockResponses/dvtApplication.mock';
import { Tags } from 'tests/shared/consts/common.const';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe('Operator with keys. IDVTC. Application status', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();
    await signInForm.signIn();
  });

  test.afterAll(async ({ widgetService, widgetConfig }) => {
    await test.step('Clear storage, unroute and disable flag', async () => {
      await widgetService.page.evaluate(() => sessionStorage.clear());
      await widgetService.page.unroute(
        `${widgetConfig.standConfig.mockConfig?.urls.csmSurveysApi}/dvt/status`,
      );
      await widgetService.setFeatureFlag('icsApplyForm', false);
    });
  });

  test(
    qase(480, 'Should show pending status when in review'),
    async ({ widgetService, httpMockerService }) => {
      const status =
        widgetService.operatorType.dvtApplicationForm.applicationFormStatus;

      await test.step('Open application in REVIEW status', async () => {
        await httpMockerService.mockDvtStatus(
          buildDvtStatusResponse({ status: dvtApplicationStatus.REVIEW }),
        );
        await widgetService.page.reload();
        await status.form.waitFor({ state: 'visible' });
      });

      await expect(status.statusChip).toContainText('Pending');
      await expect(status.form).toContainText('Application');
      await expect(status.form).toContainText(
        'You cannot change the application while it is being reviewed.',
      );
    },
  );

  test(
    qase(463, 'Should show approved status'),
    async ({ widgetService, httpMockerService }) => {
      const status =
        widgetService.operatorType.dvtApplicationForm.applicationFormStatus;

      await test.step('Open application in APPROVED status', async () => {
        await httpMockerService.mockDvtStatus(
          buildDvtStatusResponse({ status: dvtApplicationStatus.APPROVED }),
        );
        await widgetService.page.reload();
        await status.form.waitFor({ state: 'visible' });
      });

      await test.step('Both application and operator type chips are shown', async () => {
        await expect(status.statusChip).toContainText('Approved');
        await expect(status.operatorTypeChip).toContainText('Pending');
      });

      await expect(status.form).toContainText(
        'Please await issuance; this process typically takes up to three weeks.',
      );
    },
  );

  test(
    qase(464, 'Should show rejected status with reason and apply again'),
    async ({ widgetService, httpMockerService }) => {
      const dvtForm = widgetService.operatorType.dvtApplicationForm;
      const status = dvtForm.applicationFormStatus;
      const reason =
        'Your application was rejected by the CSM committee. Some cluster members do not meet the eligibility criteria.';

      await test.step('Open application in REJECTED status', async () => {
        await dvtForm.applyForm.clearPersisted();
        await httpMockerService.mockDvtStatus(
          buildDvtStatusResponse({
            status: dvtApplicationStatus.REJECTED,
            comments: { reason },
          }),
        );
        await widgetService.page.reload();
        await status.form.waitFor({ state: 'visible' });
      });

      await test.step('Rejected chip and reason are shown', async () => {
        await expect(status.statusChip).toContainText('Rejected');
        await expect(status.form).toContainText(reason);
      });

      await test.step('Apply again returns to the form', async () => {
        await expect(status.applyAgainBtn).toBeVisible();
        await status.applyAgainBtn.click();
        await expect(dvtForm.applyForm.form).toBeVisible();
      });

      await test.step('Rejected application state is not restored into the form', async () => {
        await expect(dvtForm.applyForm.discordLinkInput).toHaveValue('');
        await expect(
          dvtForm.applyForm.getClusterMember(0).addressInput,
        ).toHaveValue('');
        await expect(
          dvtForm.applyForm.getClusterMember(1).addressInput,
        ).toHaveValue('');
      });
    },
  );

  test(
    qase(434, 'Should show submitted form fields'),
    { tag: [Tags.smoke] },
    async ({ widgetService, httpMockerService }) => {
      const status =
        widgetService.operatorType.dvtApplicationForm.applicationFormStatus;
      const response = buildDvtStatusResponse({
        form: {
          mainAddress: '0xbc441b7c650f2dc3514cb5f39fb8efb3cc03cb22',
          discordLink: 'https://discord.com/channels/123/456/789',
          telegramUsername: 'main_tg',
          clusterMembers: [
            {
              address: '0x2c71755ed6c5be0d35a893cfab253f5291a512d8',
              discordHandle: 'member_discord',
              telegramUsername: 'member_tg',
            },
            { address: '0xa6fc0e8ec1be92b5786baf4f5ecb9a453d527067' },
            { address: '0x134ca9328f6b4b2564d58af2904804c73385d015' },
            { address: '0x649d105904ea2f14073bc34a173486644705aada' },
          ],
        },
      });

      await test.step('Open application and expand details', async () => {
        await httpMockerService.mockDvtStatus(response);
        await widgetService.page.reload();
        await status.form.waitFor({ state: 'visible' });
        await status.expand();
      });

      await test.step('Main address and socials are shown', async () => {
        await expect(status.mainAddressInput).toHaveValue(
          response.form.mainAddress,
        );
        await expect(status.mainAddressInput).toBeDisabled();
        await expect(status.discordLinkInput).toHaveValue(
          response.form.discordLink ?? '',
        );
        await expect(status.telegramUsernameInput).toHaveValue('main_tg');
      });

      await test.step('All cluster members are shown', async () => {
        await expect(status.clusterMembersTitle).toContainText(
          'Cluster member addresses',
        );
        for (const [index, member] of response.form.clusterMembers.entries()) {
          const addressText = await status
            .getClusterMemberAddress(index)
            .innerText();
          expect(addressText.toLowerCase()).toContain(
            member.address.toLowerCase(),
          );
        }
      });

      await test.step('Optional member contacts are shown', async () => {
        const member0 = status.getClusterMemberInfo(0);
        await expect(member0).toContainText('Discord:');
        await expect(member0).toContainText('member_discord');
        await expect(member0).toContainText('Telegram:');
        await expect(member0).toContainText('member_tg');
      });
    },
  );

  test(
    qase(465, 'Should show committee comments on fields'),
    async ({ widgetService, httpMockerService }) => {
      const status =
        widgetService.operatorType.dvtApplicationForm.applicationFormStatus;
      const comments = {
        reason:
          'Several fields need corrections before you can resubmit the application.',
        mainAddress: 'This address is already registered as a Node Operator.',
        discordLink: 'The provided Discord message link is not accessible.',
        telegramUsername: 'Please provide a valid Telegram username.',
        clusterMembers: [
          'This address is not ICS-approved.',
          null,
          'This address is already used in another cluster.',
          null,
        ],
      };
      const response = buildDvtStatusResponse({
        status: dvtApplicationStatus.REJECTED,
        form: {
          mainAddress: '0xbc441b7c650f2dc3514cb5f39fb8efb3cc03cb22',
          discordLink: 'https://discord.com/channels/123/456/789',
          telegramUsername: 'main_tg',
          clusterMembers: [
            { address: '0x2c71755ed6c5be0d35a893cfab253f5291a512d8' },
            { address: '0xa6fc0e8ec1be92b5786baf4f5ecb9a453d527067' },
            { address: '0x134ca9328f6b4b2564d58af2904804c73385d015' },
            { address: '0x649d105904ea2f14073bc34a173486644705aada' },
          ],
        },
        comments,
      });

      await test.step('Open rejected application and expand details', async () => {
        await httpMockerService.mockDvtStatus(response);
        await widgetService.page.reload();
        await status.form.waitFor({ state: 'visible' });
        await status.expand();
      });

      await test.step('Field-level comments are shown', async () => {
        await expect(status.applicationSection).toContainText(
          comments.mainAddress,
        );
        await expect(status.applicationSection).toContainText(
          comments.discordLink,
        );
        await expect(status.applicationSection).toContainText(
          comments.telegramUsername,
        );
      });

      await test.step('Cluster member comments are shown on the right members', async () => {
        await expect(status.getClusterMemberInfo(0)).toContainText(
          comments.clusterMembers[0] ?? '',
        );
        await expect(status.getClusterMemberInfo(2)).toContainText(
          comments.clusterMembers[2] ?? '',
        );
      });
    },
  );
});
