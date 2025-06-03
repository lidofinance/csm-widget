import { expect, Page, test } from '@playwright/test';
import { ElementController } from './elements/controller';
import { WalletPage, WalletTypes } from '@lidofinance/wallets-testing-wallets';
import { MainPage } from './main.page';
import { KeysPage } from './keys.page';
import { DepositKey } from 'tests/consts/keys.const';
import { TokenSymbol } from 'tests/consts/common.const';
import { AssertionError } from 'assert';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';

export class WidgetService {
  public mainPage: MainPage;
  public keysPage: KeysPage;
  constructor(
    public page: Page,
    public walletPage: WalletPage<WalletTypes.EOA>,
  ) {
    this.mainPage = new MainPage(this.page);
    this.keysPage = new KeysPage(this.page);
  }

  async connectWallet(expectConnectionState = true) {
    await test.step('Open default page for connect.', async () => {
      await this.page.goto('/');
    });
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

  async submitKeys(keys: DepositKey[], tokenSymbol = TokenSymbol.STETH) {
    const isNewOperator = await this.keysPage.isNewOperator();
    let txPage;
    if (isNewOperator) {
      txPage = await this.keysPage.createNodeOperatorForm.addNewKeys(
        keys,
        tokenSymbol,
      );
    } else {
      txPage = await this.keysPage.submitPage.submitKeys(keys, tokenSymbol);
    }

    if (!txPage) {
      throw new AssertionError({
        message: 'Wallet page for submit transaction has not opened.',
      });
    }

    await this.walletPage.confirmTx(txPage);
    await this.page.waitForSelector(
      `text=Uploading operation was successful.`,
      STAGE_WAIT_TIMEOUT,
    );
  }

  async removeKeys(keysToRemove: string[]) {
    await test.step(`Remove ${keysToRemove.length} keys`, async () => {
      for (const key of keysToRemove) {
        await this.keysPage.removePage.getCheckboxByAddress(key).click();
      }

      const [walletSignPage] = await Promise.all([
        this.keysPage.base.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        this.page.getByRole('button', { name: 'Remove Keys' }).click(),
      ]);

      await this.walletPage.confirmTx(walletSignPage);
      await this.keysPage.page.waitForSelector(
        `text=${keysToRemove.length} key has been removed`,
        STAGE_WAIT_TIMEOUT,
      );
      await this.keysPage.base.closeModalWindow();
    });
  }

  async isConnectedWallet() {
    return test.step('Check wallet connection', async () => {
      return new ElementController(this.page).header.isAccountSectionVisible();
    });
  }
}
