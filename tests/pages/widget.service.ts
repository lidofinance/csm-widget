import { expect, Page, test } from '@playwright/test';
import { ElementController } from './elements/controller';
import { WalletPage, WalletTypes } from '@lidofinance/wallets-testing-wallets';

export class WidgetService {
  constructor(
    public page: Page,
    public walletPage: WalletPage<WalletTypes.EOA>,
  ) {}

  async connectWallet(expectConnectionState = true) {
    await test.step('Connect wallet to widget', async () => {
      const element = new ElementController(this.page);
      if (await this.isConnectedWallet()) return;
      await element.header.connectWalletBtn.click();
      await element.termAndPrivacy.confirmConditionWalletModal();
      const walletIcon = element.connectWalletModal.getWalletInModal(
        this.walletPage.config.COMMON.CONNECT_BUTTON_NAME,
      );
      if (
        (await walletIcon.isEnabled({ timeout: 500 })) &&
        this.walletPage.config.COMMON.WALLET_TYPE === WalletTypes.EOA
      ) {
        try {
          const [connectWalletPage] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout: 90000 }),
            // @Fixme dbclick() when https://linear.app/lidofi/issue/SI-1447/mm-incorrect-network-required-double-click resolved
            await walletIcon.dblclick(),
          ]);
          await this.walletPage.connectWallet(connectWalletPage);
        } catch {
          console.error('Wallet page didnt open');
        }
      }

      expect(
        await this.isConnectedWallet(),
        expectConnectionState
          ? 'Wallet should be connected'
          : 'Wallet should be disconnected',
      ).toBe(expectConnectionState);
    });
  }

  async isConnectedWallet() {
    return test.step('Check wallet connection', async () => {
      return new ElementController(this.page).header.isAccountSectionVisible();
    });
  }
}
