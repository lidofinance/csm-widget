import { Locator, Page } from '@playwright/test';
import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { BasePage } from 'tests/pages/base.page';
import { AdditionalAddressPage } from './additionalAddress.page';

export class SubmitApplicationForm extends BasePage {
  form: Locator;

  mainAddressSection: Locator;
  mainAddressTitle: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;
  mainAddressVerifiedChip: Locator;

  additionalAddressesSection: Locator;
  addNewAddressBtn: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    super(page);
    this.form = page.getByTestId('applyForm');

    this.mainAddressSection = this.form.getByTestId('mainAddressSection');
    this.mainAddressTitle = this.mainAddressSection.getByTestId('formTitle');
    this.mainAddressInput = this.mainAddressSection.locator(
      'input[name="mainAddress"]',
    );
    this.mainAddressLabel = this.mainAddressSection.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );
    this.mainAddressVerifiedChip =
      this.mainAddressSection.getByTestId('verifiedChip');

    this.additionalAddressesSection = this.form.getByTestId(
      'additionalAddressesSection',
    );
    this.addNewAddressBtn =
      this.additionalAddressesSection.getByTestId('addNewAddressBtn');
  }

  getAdditionalAddressFieldByIndex(index: number) {
    return new AdditionalAddressPage(
      this.page,
      index,
      this.additionalAddressesSection,
    );
  }

  async fillAdditionalAddress(index: number, address: string) {
    const addressInput = this.additionalAddressesSection.locator(
      `xpath=(//input[@name="additionalAddresses.${index}.address"])`,
    );

    await addressInput.fill(address);
  }

  async submitApplication() {
    // let txPage;
    // await test.step('Sign in a message to prove ownership', async () => {
    //   const signInButton = this.form.getByRole('button', { name: 'Sign in' });
    //   [txPage] = await Promise.all([
    //     this.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
    //     signInButton.click(),
    //   ]);
    //   await this.page.waitForSelector(`text=Please sign the message`, {
    //     timeout: STAGE_WAIT_TIMEOUT,
    //   });
    //   await this.walletPage.confirmTx(txPage);
    //   await this.page.waitForSelector(`text=Submit application`, {
    //     timeout: STAGE_WAIT_TIMEOUT,
    //   });
    // });
  }
}
