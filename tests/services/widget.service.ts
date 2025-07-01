import { expect, Page, test } from '@playwright/test';
import { ElementController } from '../pages/elements/controller';
import { WalletPage, WalletTypes } from '@lidofinance/wallets-testing-wallets';
import { MainPage, KeysPage, DashboardPage } from '../pages';
import { DepositKey } from 'tests/consts/keys.const';
import { TokenSymbol } from 'tests/consts/common.const';
import { AssertionError } from 'assert';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { BondRewardsPage } from 'tests/pages/bondRewards.page';
import { TOKENS } from 'consts/tokens';
import { BondRewardsPage } from 'tests/pages/bondRewards.page';
import { TOKENS } from 'consts/tokens';

export class WidgetService {
  public mainPage: MainPage;
  public keysPage: KeysPage;
  public dashboardPage: DashboardPage;
  public bondRewardsPage: BondRewardsPage;

  constructor(
    public page: Page,
    public walletPage: WalletPage<WalletTypes.EOA>,
  ) {
    this.mainPage = new MainPage(this.page);
    this.keysPage = new KeysPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.bondRewardsPage = new BondRewardsPage(this.page);
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
        this.walletPage.walletConfig.CONNECT_BUTTON_NAME,
      );
      if (
        (await walletIcon.isEnabled({ timeout: 500 })) &&
        this.walletPage.walletConfig.WALLET_TYPE === WalletTypes.EOA
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
      { timeout: STAGE_WAIT_TIMEOUT },
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
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      await this.keysPage.base.closeModalWindow();
    });
  }

  async addBond(tokenName: TOKENS, amount: string) {
    await test.step(`Add ${amount} ${tokenName} as bond`, async () => {
      await test.step(`Choose ${tokenName} symbol for bond`, async () => {
        const bondToken =
          this.bondRewardsPage.addBond.selectBondToken(tokenName);
        await bondToken.click();
      });

      await this.bondRewardsPage.addBond.amountInput.fill(amount);

      let [txPage] = await Promise.all([
        this.bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        this.bondRewardsPage.addBond.addBondButton.click(),
      ]);

      if (tokenName !== TOKENS.ETH) {
        await this.bondRewardsPage.page.waitForSelector(
          `text=Confirm request in your wallet`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        [txPage] = await Promise.all([
          this.bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          this.walletPage.confirmTx(txPage),
        ]);
      }

      await this.page.waitForSelector(
        `text=Confirm this transaction in your wallet`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      await this.walletPage.confirmTx(txPage);
      await this.page.waitForSelector(`text=Awaiting block confirmation`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await this.page.waitForSelector(
        `text=Adding Bond operation was successful`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await this.bondRewardsPage.closeModalWindow();
    });
  }

  async claim(tokenName: TOKENS, amount: string) {
    await test.step(`Claim ${amount} ${tokenName}`, async () => {
      await test.step(`Choose ${tokenName} symbol for claim`, async () => {
        const token = this.bondRewardsPage.claim.selectBondToken(tokenName);
        await token.click();
      });

      await this.bondRewardsPage.claim.amountInput.fill(amount);

      const actionButton =
        tokenName === TOKENS.ETH
          ? this.bondRewardsPage.claim.requestWithdrawalButton
          : this.bondRewardsPage.claim.claimButton;

      const [txPage] = await Promise.all([
        this.bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        actionButton.click(),
      ]);

      await this.page.waitForSelector(
        `text=Confirm this transaction in your wallet`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      await this.walletPage.confirmTx(txPage);

      const successText =
        tokenName === TOKENS.ETH
          ? 'Withdrawal request has been sent'
          : 'Requested amount has been successfully claimed';

      await this.page.waitForSelector(`text=${successText}`, {
        timeout: STAGE_WAIT_TIMEOUT,
      });

      await this.bondRewardsPage.closeModalWindow();
    });
  }

  async isConnectedWallet() {
    return test.step('Check wallet connection', async () => {
      return new ElementController(this.page).header.isAccountSectionVisible();
    });
  }

  async extractNodeOperatorId(): Promise<number> {
    return test.step('Extract node operator id from header', async () => {
      const rawHeader = await this.page
        .getByTestId('nodeOperatorHeader')
        .textContent();

      if (!rawHeader)
        throw new Error('Failed to get text content from node operator header');

      const match = rawHeader.match(/#(\d+)/);
      if (!match) throw new Error('Cannot extract ID from header');
      return Number(match[1]);
    });
  }
}
