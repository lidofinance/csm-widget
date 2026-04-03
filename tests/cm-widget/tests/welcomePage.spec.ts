import { WelcomePage } from '../pages';
import { test } from './test.fixture';
import { PAGE_WAIT_TIMEOUT } from '../../shared/consts/timeouts';
import { expect } from '@playwright/test';

test.describe('Welcome page without connected wallet', () => {
  test('Should open connect modal after click to "I am a Node Operator"', async ({
    page,
  }) => {
    const homePage = new WelcomePage(page);
    await homePage.goto();
    await homePage.welcomeSection.connectWallet.click();

    await homePage.connectWalletModal.modal.waitFor({ state: 'visible' });
  });

  test('Should open cm v1 tab after click to "Open CM v1 widget"', async ({
    page,
  }) => {
    const homePage = new WelcomePage(page);
    await homePage.goto('');
    const [cmv1] = await Promise.all([
      homePage.waitForPage(PAGE_WAIT_TIMEOUT),
      homePage.welcomeSection.navigateToCMv1Btn.click(),
    ]);

    expect(cmv1.url().toLowerCase()).toContain(
      `https://operators-hoodi.testnet.fi/`,
    );
  });
});
