import { WelcomePage } from 'tests/pages/welcome.page';
import { test } from './test.fixture';

test.describe.skip('Welcome page without connected wallet', async () => {
  test('Should open connect modal after click to "I am a Node Operator"', async ({
    page,
  }) => {
    const homePage = new WelcomePage(page);
    await homePage.goto();

    await homePage.welcomeSection.iAmANodeOperatorBtn.click();

    await homePage.connectWalletModal.modal.waitFor({ state: 'visible' });
  });

  test('Should open connect modal after click to "Become a Node Operator"', async ({
    page,
  }) => {
    const homePage = new WelcomePage(page);
    await homePage.goto();

    await homePage.welcomeSection.becomeANodeOperatorBtn.click();

    await homePage.connectWalletModal.modal.waitFor({ state: 'visible' });
  });
});
