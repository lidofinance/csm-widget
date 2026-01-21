import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { ApplicationForm } from 'tests/pages/tabs/operatorType/applicationForm.page';
import {
  applicationStatus,
  applyApplicationMockResponse,
} from 'tests/services/mockResponses/applyApplication.mock';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase: secretPhrase });

test.describe('Operator with keys. ICS. Apply application. Addresses', async () => {
  let applicationForm: ApplicationForm;
  test.beforeEach(async ({ widgetService }) => {
    applicationForm = widgetService.operatorType.applicationForm;

    await applicationForm.open();

    const alreadySignIn =
      await applicationForm.submitApplicationForm.submitBtn.isVisible();
    if (!alreadySignIn) await applicationForm.signInForm.signIn();
  });

  test.afterAll(async ({ widgetService, widgetConfig }) => {
    await test.step('Clear session storage', async () => {
      await widgetService.page.evaluate(() => {
        sessionStorage.clear();
      });
      await widgetService.page.unroute(
        `${widgetConfig.standConfig.mockConfig?.urls.csmSurveysApi}/ics/status`,
      );
    });
  });

  test('Should correctly show applicatioin status for pending only mainAddress', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });
    await expect(applicationForm.applicationFormStatus.scoreChip).toBeVisible();
    await expect(applicationForm.applicationFormStatus.scoreChip).toContainText(
      'Pending',
    );

    await applicationForm.applicationFormStatus.applicationInfo.click();

    await test.step('Verify main address input', async () => {
      const address = mnemonicToAccount(secretPhrase).address;
      await expect(
        applicationForm.applicationFormStatus.mainAddressInput,
      ).toHaveValue(address);
      await expect(
        applicationForm.applicationFormStatus.mainAddressLabel,
      ).toBeDisabled();
    });
  });

  test('Should correctly show applicatioin status for pending with additional address', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;

    applyApplicationMockResponse.form.additionalAddresses = Array.from(
      { length: 5 },
      () => mnemonicToAccount(generateMnemonic(english, 128)).address,
    );

    await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    await widgetService.page.reload();

    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });
    await expect(applicationForm.applicationFormStatus.scoreChip).toBeVisible();
    await expect(applicationForm.applicationFormStatus.scoreChip).toContainText(
      'Pending',
    );

    await applicationForm.applicationFormStatus.applicationInfo.click();
    await applicationForm.applicationFormStatus.mainAddressInput.waitFor({
      state: 'visible',
    });

    await test.step('Check all additional addresses', async () => {
      for (const [
        i,
        additionalAddress,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ] of applyApplicationMockResponse.form.additionalAddresses!.entries()) {
        await test.step(`Check additional address ${additionalAddress} #${i + 1}`, async () => {
          const additionalAddressField =
            applicationForm.applicationFormStatus.applicationSection.getByTestId(
              `additionalAddressInfo-${i}`,
            );
          await expect(additionalAddressField).toBeVisible();
          await expect(additionalAddressField.locator('input')).toHaveValue(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            additionalAddress!,
          );
          await expect(additionalAddressField.locator('input')).toBeDisabled();
        });
      }
    });
  });

  test('Should correctly show applicatioin status for pending with socials links', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;

    applyApplicationMockResponse.form.twitterLink =
      'https://x.com/someuser/status/1234567890';
    applyApplicationMockResponse.form.discordLink =
      'https://discord.com/channels/123/456/789';

    await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    await widgetService.page.reload();

    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });
    await expect(applicationForm.applicationFormStatus.scoreChip).toBeVisible();
    await expect(applicationForm.applicationFormStatus.scoreChip).toContainText(
      'Pending',
    );

    await applicationForm.applicationFormStatus.applicationInfo.click();
    await applicationForm.applicationFormStatus.mainAddressInput.waitFor({
      state: 'visible',
    });

    await test.step('Check all socials links', async () => {
      await expect(
        applicationForm.applicationFormStatus.twitterLinkInput,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ).toHaveValue(applyApplicationMockResponse.form.twitterLink!);
      await expect(
        applicationForm.applicationFormStatus.twitterLinkInput,
      ).toBeDisabled();

      await expect(
        applicationForm.applicationFormStatus.discordLinkInput,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ).toHaveValue(applyApplicationMockResponse.form.discordLink!);
      await expect(
        applicationForm.applicationFormStatus.discordLinkInput,
      ).toBeDisabled();
    });
  });

  test('Should correctly show applicatioin status for rejected', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;
    applyApplicationMockResponse.status = applicationStatus.REJECTED;

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });
    await expect(applicationForm.applicationFormStatus.scoreChip).toBeVisible();
    await expect(applicationForm.applicationFormStatus.scoreChip).toContainText(
      'Rejected',
    );
    await expect(applicationForm.applicationFormStatus.form).toContainText(
      'Your application earned 0 out of the 15 points required to qualify',
    );

    await expect(
      applicationForm.applicationFormStatus.applyAgainBtn,
    ).toBeVisible();

    await applicationForm.applicationFormStatus.applyAgainBtn.click();
    await applicationForm.submitApplicationForm.form.waitFor({
      state: 'visible',
    });
  });

  test('Should correctly show proofs with points', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;
    applyApplicationMockResponse.status = applicationStatus.REJECTED;
    applyApplicationMockResponse.scores = {
      ...applyApplicationMockResponse.scores,
      sdvtMainnet: 2,
      discord: 1,
      lidoGalxe: 1,
    };

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });
    await expect(applicationForm.applicationFormStatus.scoreChip).toBeVisible();
    await expect(applicationForm.applicationFormStatus.scoreChip).toContainText(
      'Rejected',
    );
    await expect(applicationForm.applicationFormStatus.form).toContainText(
      'Your application earned 4 out of the 15 points required to qualify',
    );

    await test.step('Verify types of proofs sections', async () => {
      await expect(
        applicationForm.applicationFormStatus.totalScoreBreakdown,
      ).toBeVisible();
      await expect(
        applicationForm.applicationFormStatus.proofOfHumanityCollapse,
      ).toBeVisible();
      await expect(
        applicationForm.applicationFormStatus.proofOfExperienceCollapse,
      ).toBeVisible();
      await expect(
        applicationForm.applicationFormStatus.proofOfEngagementCollapse,
      ).toBeVisible();
    });

    await test.step('Verify points of each proof section', async () => {
      await expect(
        applicationForm.applicationFormStatus.totalScoreBreakdown,
      ).toContainText('4 points');
      await expect(
        applicationForm.applicationFormStatus.proofOfHumanityCollapse,
      ).toContainText('1 point');
      await expect(
        applicationForm.applicationFormStatus.proofOfExperienceCollapse,
      ).toContainText('2 points');
      await expect(
        applicationForm.applicationFormStatus.proofOfEngagementCollapse,
      ).toContainText('1 point');
    });
  });

  test('Should correctly show proofOfExperience info', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;
    applyApplicationMockResponse.status = applicationStatus.REJECTED;
    applyApplicationMockResponse.scores = {
      ...applyApplicationMockResponse.scores,
      ethStaker: 6,
      stakeCat: 1,
      obolTechne: 1,
      ssvVerified: 1,
      csmTestnet: 1,
      csmMainnet: 1,
      sdvtTestnet: 1,
      sdvtMainnet: 6,
    };

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });

    const proofOfExperienceCollapse =
      applicationForm.applicationFormStatus.proofOfExperienceCollapse;

    await test.step('Verify max points for category', async () => {
      await expect(proofOfExperienceCollapse).toContainText('8 points');
    });

    await test.step('Expand proofOfExperience category', async () => {
      await proofOfExperienceCollapse.click();
      await proofOfExperienceCollapse
        .getByTestId('categoryItemsWrapper')
        .waitFor({ state: 'visible' });
    });

    await test.step('Verify min score tip is not visible', async () => {
      await expect(
        proofOfExperienceCollapse.getByTestId('minScoreTip'),
      ).toBeHidden();
    });

    await test.step('Verify all score items', async () => {
      const scoreItems = await proofOfExperienceCollapse
        .getByTestId('scoreItem')
        .all();

      const expectedLabels = [
        'EthStaker solo-stakers list',
        'StakeCat solo-stakers list',
        'Obol Techne',
        'SSV Verified operators',
        'CSM testnet participation',
        'CSM mainnet participation',
        'SDVTM testnet participation',
        'SDVTM mainnet participation',
      ];
      expect(scoreItems).toHaveLength(expectedLabels.length);

      for (const [i, item] of scoreItems.entries()) {
        const scoreLabel = await item.getByTestId('scoreLabel').innerText();
        const scoreValue = await item.getByTestId('scoreValue').innerText();
        expect(scoreLabel).toBe(expectedLabels[i]);
        expect(scoreValue).toMatch(/\d+ point(s)?/);
      }
    });
  });

  test('Should correctly show proofOfHumanity info', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;
    applyApplicationMockResponse.status = applicationStatus.REJECTED;
    applyApplicationMockResponse.scores = {
      ...applyApplicationMockResponse.scores,
      humanPassport: 6,
      circles: 1,
      discord: 1,
      twitter: 1,
    };

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });

    const proofOfHumanityCollapse =
      applicationForm.applicationFormStatus.proofOfHumanityCollapse;

    await test.step('Verify max points for category', async () => {
      await expect(proofOfHumanityCollapse).toContainText('8 points');
    });

    await test.step('Expand proofOfHumanity category', async () => {
      await proofOfHumanityCollapse.click();
      await proofOfHumanityCollapse
        .getByTestId('categoryItemsWrapper')
        .waitFor({ state: 'visible' });
    });

    await test.step('Verify min score tip is not visible', async () => {
      await expect(
        proofOfHumanityCollapse.getByTestId('minScoreTip'),
      ).toBeHidden();
    });

    await test.step('Verify all score items', async () => {
      const scoreItems = await proofOfHumanityCollapse
        .getByTestId('scoreItem')
        .all();

      const expectedLabels = ['Human passport', 'Circles', 'Discord', 'X'];
      expect(scoreItems).toHaveLength(expectedLabels.length);

      for (const [i, item] of scoreItems.entries()) {
        const scoreLabel = await item.getByTestId('scoreLabel').innerText();
        const scoreValue = await item.getByTestId('scoreValue').innerText();
        expect(scoreLabel).toBe(expectedLabels[i]);
        expect(scoreValue).toMatch(/\d+ point(s)?/);
      }
    });
  });

  test('Should correctly show proofOfEngagement info', async ({
    widgetService,
    secretPhrase,
    httpMockerService,
  }) => {
    applyApplicationMockResponse.form.mainAddress =
      mnemonicToAccount(secretPhrase).address;
    applyApplicationMockResponse.status = applicationStatus.REJECTED;
    applyApplicationMockResponse.scores = {
      ...applyApplicationMockResponse.scores,
      aragonVotes: 1,
      snapshotVotes: 1,
      lidoGalxe: 5,
      highSignal: 1,
      gitPoaps: 1,
    };

    await test.step('Mock ICS Status request', async () => {
      await httpMockerService.mockIcsStatus(applyApplicationMockResponse);
    });

    await widgetService.page.reload();
    await applicationForm.applicationFormStatus.form.waitFor({
      state: 'visible',
    });

    const proofOfEngagementCollapse =
      applicationForm.applicationFormStatus.proofOfEngagementCollapse;

    await test.step('Verify max points for category', async () => {
      await expect(proofOfEngagementCollapse).toContainText('7 points');
    });

    await test.step('Expand proofOfEngagement category', async () => {
      await proofOfEngagementCollapse.click();
      await proofOfEngagementCollapse
        .getByTestId('categoryItemsWrapper')
        .waitFor({ state: 'visible' });
    });

    await test.step('Verify min score tip is not visible', async () => {
      await expect(
        proofOfEngagementCollapse.getByTestId('minScoreTip'),
      ).toBeHidden();
    });

    await test.step('Verify all score items', async () => {
      const scoreItems = await proofOfEngagementCollapse
        .getByTestId('scoreItem')
        .all();

      const expectedLabels = [
        'Participation in Aragon Votes',
        'Participation in Snapshot Votes',
        'Lido Galxe score',
        'Lido High Signal score',
        'GitPOAPs',
      ];
      expect(scoreItems).toHaveLength(expectedLabels.length);

      for (const [i, item] of scoreItems.entries()) {
        const scoreLabel = await item.getByTestId('scoreLabel').innerText();
        const scoreValue = await item.getByTestId('scoreValue').innerText();
        expect(scoreLabel).toBe(expectedLabels[i]);
        expect(scoreValue).toMatch(/\d+ point(s)?/);
      }
    });
  });
});
