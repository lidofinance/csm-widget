import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { TxModal } from './elements/common/element.txProgressModal';
import { ApplicationForm } from './tabs/operatorType/ics/applicationForm.page';
import { DvtApplicationForm } from './tabs/operatorType/idvtc/dvtApplicationForm.page';
import { ClaimIdvtcPage } from './tabs/operatorType/idvtc/claimIdvtc.page';
import { ClaimIcsPage } from './tabs/operatorType/ics/claimIcs.page';

export class OperatorTypePage extends BasePage {
  applicationForm: ApplicationForm;
  dvtApplicationForm: DvtApplicationForm;
  claimIdvtc: ClaimIdvtcPage;
  claimIcs: ClaimIcsPage;
  txModal: TxModal;

  idvtcApplyButton: Locator;
  idvtcIssuedChip: Locator;
  claimAlert: Locator;
  claimAlertButton: Locator;
  navClaimCounter: Locator;
  claimPageTitle: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.applicationForm = new ApplicationForm(page, walletPage);
    this.dvtApplicationForm = new DvtApplicationForm(page, walletPage);
    this.claimIdvtc = new ClaimIdvtcPage(page);
    this.claimIcs = new ClaimIcsPage(page);
    this.txModal = new TxModal(page);

    this.idvtcApplyButton = this.page.getByTestId('dvtApplyButton');
    this.idvtcIssuedChip = this.page
      .getByTestId('scoreChip')
      .filter({ hasText: 'Issued' });
    this.claimAlert = this.page.getByTestId('claimIdvtcAlert');
    this.claimAlertButton = this.claimAlert.getByRole('button', {
      name: 'Go to Claim page',
    });
    this.navClaimCounter = this.page
      .getByTestId('navItem')
      .filter({ hasText: 'Operator Type' })
      .getByTestId('navCounter');
    this.claimPageTitle = this.page.getByTestId('pageTitle');
  }

  async openTypePage() {
    await test.step('Open the Operator Type page', async () => {
      await this.page.goto('/type');
    });
  }
}
