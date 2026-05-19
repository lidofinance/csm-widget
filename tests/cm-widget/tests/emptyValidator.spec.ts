import { generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { test } from './test.fixture';
import { WelcomePage } from '../pages';
import { PAGE_WAIT_TIMEOUT } from '../../shared/consts/timeouts';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: generateMnemonic(english, 128) });

test.describe('Welcome page with connected wallet without operator', () => {
  test(
    qase(10, 'Should display correct text content in not eligible section'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Check heading text', async () => {
        await expect(
          notEligiblePage.notEligibleSection,
          'Not eligible section should display correct heading',
        ).toContainText('You’re not eligible to create a Node Operator');
      });

      await test.step('Check description text', async () => {
        await expect(
          notEligiblePage.notEligibleSection,
          'Not eligible section should display module description',
        ).toContainText(
          'The Curated Module v2 consists of allow-listed independent professional staking organizations and Ethereum client teams, which operate validators using the protocol. For a detailed description of the module, follow',
        );

        await expect(
          notEligiblePage.notEligibleSection,
          'Description should contain "the link" anchor',
        ).toContainText('the link');
      });

      await test.step('Check disconnect button text', async () => {
        await expect(
          notEligiblePage.disconnectBtn,
          'Disconnect button should have correct label',
        ).toContainText('Disconnect');
      });
    },
  );

  test(
    qase(7, 'Should display correct text content in Try Lido CSM section'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Check heading text', async () => {
        await expect(
          notEligiblePage.tryCsmSection,
          'Try CSM section should display "Try Lido CSM" heading',
        ).toContainText('Try Lido CSM');
      });

      await test.step('Check description text', async () => {
        await expect(
          notEligiblePage.tryCsmSection,
          'Try CSM section should display CSM module description',
        ).toContainText(
          'The Community Staking Module (CSM) is a permissionless staking module aimed at attracting community stakers to participate in the Lido protocol as Node Operators. For a detailed description of the module, follow',
        );
      });

      await test.step('Check Join CSM button text', async () => {
        await expect(
          notEligiblePage.joinCsmBtn,
          'Join CSM button should have correct label',
        ).toContainText('Join CSM');
      });
    },
  );

  test(
    qase(
      8,
      'Should open a new tab after click to "the link" in not eligible description',
    ),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Click "the link" and check new tab URL', async () => {
        const [detailedPage] = await Promise.all([
          notEligiblePage.waitForPage(PAGE_WAIT_TIMEOUT),
          notEligiblePage.notEligibleDetailedLink.click(),
        ]);

        expect(
          detailedPage.url().toLowerCase(),
          'New tab should open Lido operator portal for Curated Module',
        ).toContain('https://operatorportal.lido.fi/modules/curated-module');
      });
    },
  );

  test(
    qase(9, 'Should open a new tab after click to "Join CSM"'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Click "Join CSM" and check new tab URL', async () => {
        const [csmPage] = await Promise.all([
          notEligiblePage.waitForPage(PAGE_WAIT_TIMEOUT),
          notEligiblePage.joinCsmBtn.click(),
        ]);

        expect(
          csmPage.url().toLowerCase(),
          'New tab should open CSM widget',
        ).toContain('https://csm.testnet.fi/');
      });
    },
  );

  test(
    qase(
      11,
      'Should display correct text content in navigate to CM v1 section',
    ),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Check heading text', async () => {
        await expect(
          notEligiblePage.navigateCMv1Section,
          'CM v1 section should display "Navigate to CM v1" heading',
        ).toContainText('Navigate to CM v1');
      });

      await test.step('Check button text', async () => {
        await expect(
          notEligiblePage.navigateToCMv1Btn,
          '"Open CM v1 widget" button should have correct label',
        ).toContainText('Open CM v1 widget');
      });

      await test.step('Check description text', async () => {
        await expect(
          notEligiblePage.navigateCMv1Section,
          'CM v1 section should display navigation hint text',
        ).toContainText(
          'If you are looking for the CM v1 interface, please navigate to',
        );

        await expect(
          notEligiblePage.navigateCMv1Section,
          'CM v1 section should display the host link',
        ).toContainText('operators-hoodi.testnet.fi');
      });
    },
  );

  test(
    qase(12, 'Should open cm v1 tab after click to "Open CM v1 widget"'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Click "Open CM v1 widget" and check new tab URL', async () => {
        const [cmv1] = await Promise.all([
          notEligiblePage.waitForPage(PAGE_WAIT_TIMEOUT),
          notEligiblePage.navigateToCMv1Btn.click(),
        ]);

        expect(
          cmv1.url().toLowerCase(),
          'New tab should open CM v1 widget',
        ).toContain('operators-hoodi.testnet.fi');
      });
    },
  );

  test(
    qase(14, 'Should open cm v1 tab after click to host link in description'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;

      await test.step('Click host link in CM v1 section description and check new tab URL', async () => {
        const hostLink = notEligiblePage.navigateCMv1Section.getByRole('link', {
          name: /testnet\.fi/i,
        });
        const [cmv1] = await Promise.all([
          notEligiblePage.waitForPage(PAGE_WAIT_TIMEOUT),
          hostLink.click(),
        ]);

        expect(
          cmv1.url().toLowerCase(),
          'New tab should open CM v1 widget',
        ).toContain('operators-hoodi.testnet.fi');
      });
    },
  );

  test(
    qase(13, 'Should disconnect wallet after click to "Disconnect"'),
    async ({ widgetService }) => {
      const { notEligiblePage } = widgetService;
      const welcomePage = new WelcomePage(notEligiblePage.page);

      await test.step('Click "Disconnect" button', async () => {
        await notEligiblePage.disconnectBtn.click();
      });

      await test.step('Check "Connect wallet" button is visible after disconnect', async () => {
        await expect(
          welcomePage.welcomeSection.connectWallet,
          '"Connect wallet" button should be visible after disconnect',
        ).toBeVisible();
      });
    },
  );
});
