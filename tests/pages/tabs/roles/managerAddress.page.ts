import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { Locator, Page, test } from '@playwright/test';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { BasePage } from 'tests/pages/base.page';

export class ManagerAddressPage extends BasePage {
  form: Locator;

  currentTitledAddress: Locator;
  currentAddress: Locator;
  currentAddressEtherscanLink: Locator;

  // Proposed address elements
  proposedAddress: Locator;
  pendingTitledAddress: Locator;
  pendingAddress: Locator;
  pendingAddressEtherscanLink: Locator;
  revokeButton: Locator;

  addressInput: Locator;
  inputLabel: Locator;
  validationInputTooltip: Locator;
  addressValidIcon: Locator;
  proposeButton: Locator;
  note: Locator;

  constructor(
    public page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    super(page);
    this.form = this.page.getByTestId('changeRoleForm');
    this.currentTitledAddress = this.form.getByTestId('titledAddress').nth(0);
    this.currentAddress = this.currentTitledAddress.locator('> div').nth(1);
    this.currentAddressEtherscanLink = this.currentAddress.locator('a');

    // Proposed address elements
    this.proposedAddress = this.form.getByTestId('proposedAddress');
    this.pendingTitledAddress =
      this.proposedAddress.getByTestId('titledAddress');
    this.pendingAddress = this.pendingTitledAddress.locator('> div').nth(1);
    this.pendingAddressEtherscanLink = this.pendingAddress.locator('a');
    this.revokeButton = this.proposedAddress.getByRole('button', {
      name: 'Revoke',
    });

    this.addressInput = this.form.locator('input[name="address"]');
    this.inputLabel = this.form.locator(
      'xpath=//input[@name="address"]/ancestor::label',
    );
    this.validationInputTooltip = this.inputLabel.locator('> span').nth(1);
    this.addressValidIcon = this.inputLabel.locator('svg');
    this.proposeButton = this.form.getByRole('button', {
      name: 'Propose a new manager address',
    });
    this.note = this.form.getByTestId('noteText');
  }

  async open() {
    await test.step('Open Manager Address tab', async () => {
      await this.page.goto('/roles/manager-address');
      await this.currentAddress.waitFor({ state: 'visible' });
    });
  }

  async isPendingRole() {
    return test.step('Check if rewards address role is pending', async () => {
      return this.proposedAddress.isVisible();
    });
  }

  async revokePendingRole() {
    await test.step('Revoke pending rewards address role', async () => {
      if (!(await this.isPendingRole())) {
        console.warn('No pending rewards address role to revoke');
        return;
      }

      await test.step('Do revoke', async () => {
        const [txPage] = await Promise.all([
          this.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          this.revokeButton.click(),
        ]);

        await this.page.waitForSelector(
          `text=You are revoking request for manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await this.walletPage.confirmTx(txPage);

        await this.page.waitForSelector(
          `text=Proposed request for manager address has been revoked`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await this.closeModalWindow();
    });
  }

  async proposeNewAddress(address: string) {
    await test.step('Propose a new manager address', async () => {
      if (await this.isPendingRole()) {
        console.warn('There is already a pending rewards address role');
        return;
      }

      await this.addressInput.fill(address);
      await this.page.waitForTimeout(1000);
      await this.addressValidIcon.waitFor({ state: 'visible' });

      await test.step('Do proposal', async () => {
        const [txPage] = await Promise.all([
          this.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          this.proposeButton.click(),
        ]);

        await this.page.waitForSelector(
          `text=You are proposing manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await this.walletPage.confirmTx(txPage);

        await this.page.waitForSelector(
          `text=New manager address has been proposed`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await this.closeModalWindow();
      await this.proposedAddress.waitFor({ state: 'visible' });
    });
  }
}
