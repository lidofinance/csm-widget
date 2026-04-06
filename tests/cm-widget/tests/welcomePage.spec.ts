import { WelcomePage } from '../pages';
import { test } from './test.fixture';
import { PAGE_WAIT_TIMEOUT } from '../../shared/consts/timeouts';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Welcome page without connected wallet', () => {
  test(
    qase(1, 'Should open connect modal after click to "Connect wallet"'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      await test.step('Check "Connect wallet" button text', async () => {
        await expect(
          homePage.welcomeSection.connectWallet,
          '"Connect wallet" button should have correct label',
        ).toContainText('Connect wallet');
      });

      await test.step('Click "Connect wallet" and check modal appears', async () => {
        await homePage.welcomeSection.connectWallet.click();
        await expect(
          homePage.connectWalletModal.modal,
          'Connect wallet modal should be visible after click',
        ).toBeVisible();
      });
    },
  );

  test(
    qase(2, 'Should open cm v1 tab after click to "Open CM v1 widget"'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto('');

      await test.step('Check "Open CM v1 widget" button text', async () => {
        await expect(
          homePage.welcomeSection.navigateToCMv1Btn,
          '"Open CM v1 widget" button should have correct label',
        ).toContainText('Open CM v1 widget');
      });

      await test.step('Click "Open CM v1 widget" and check new tab URL', async () => {
        const [cmv1] = await Promise.all([
          homePage.waitForPage(PAGE_WAIT_TIMEOUT),
          homePage.welcomeSection.navigateToCMv1Btn.click(),
        ]);

        expect(
          cmv1.url().toLowerCase(),
          'New tab should open operators-hoodi.testnet.fi',
        ).toContain(`https://operators-hoodi.testnet.fi/`);
      });
    },
  );

  test(
    qase(3, 'Should display correct text content in welcome section'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      const { welcomeSection } = homePage.welcomeSection;

      await test.step('Check heading text', async () => {
        await expect(
          welcomeSection,
          'Welcome section should display "Curated Module" heading',
        ).toContainText('Curated Module');
      });

      await test.step('Check description text', async () => {
        await expect(
          welcomeSection,
          'Welcome section should display full module description',
        ).toContainText(
          'The Curated Module v2 (CM) consists of allow-listed independent professional staking organizations and Ethereum client teams, which operate validators using the protocol. For a detailed description of the module, follow',
        );

        await expect(
          welcomeSection,
          'Description should contain "the link" anchor',
        ).toContainText('the link');
      });
    },
  );

  test(
    qase(4, 'Should open a new tab after click to "the link" in description'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      await test.step('Click "the link" in description and check new tab URL', async () => {
        const [detailedPage] = await Promise.all([
          homePage.waitForPage(PAGE_WAIT_TIMEOUT),
          homePage.welcomeSection.detailedLink.click(),
        ]);

        expect(
          detailedPage.url().toLowerCase(),
          'New tab should open Lido operator portal for Curated Module',
        ).toContain(`https://operatorportal.lido.fi/modules/curated-module`);
      });
    },
  );

  test(
    qase(5, 'Should display correct text content in navigate to CM v1 section'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      const { navigateCMv1Section } = homePage.welcomeSection;

      await test.step('Check heading text', async () => {
        await expect(
          navigateCMv1Section,
          'CM v1 section should display "Navigate to CM v1" heading',
        ).toContainText('Navigate to CM v1');
      });

      await test.step('Check description text', async () => {
        await expect(
          navigateCMv1Section,
          'CM v1 section should display navigation hint text',
        ).toContainText(
          'If you are looking for the CM v1 interface, please navigate to',
        );

        await expect(
          navigateCMv1Section,
          'CM v1 section should display the host link',
        ).toContainText('operators-hoodi.testnet.fi');
      });
    },
  );

  test(
    qase(6, 'Should open cm v1 tab after click to host link in description'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      await test.step('Click host link in CM v1 section description and check new tab URL', async () => {
        const hostLink = homePage.welcomeSection.navigateCMv1Section.getByRole(
          'link',
          { name: /testnet\.fi/i },
        );
        const [cmv1] = await Promise.all([
          homePage.waitForPage(PAGE_WAIT_TIMEOUT),
          hostLink.click(),
        ]);

        expect(
          cmv1.url().toLowerCase(),
          'New tab should open operators-hoodi.testnet.fi',
        ).toContain(`https://operators-hoodi.testnet.fi/`);
      });
    },
  );
});
