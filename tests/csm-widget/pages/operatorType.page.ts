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

  typeHubRows: Locator;
  idvtcApplyButton: Locator;
  idvtcIssuedChip: Locator;
  icsBanner: Locator;
  icsCardChip: Locator;
  icsApplyButton: Locator;
  claimIcsAlert: Locator;
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

    this.typeHubRows = this.page
      .getByTestId('operatorTypeCurrent')
      .or(this.page.locator('[data-testid^="operatorTypeAvailable-"]'));
    this.idvtcApplyButton = this.page.getByTestId('dvtApplyButton');
    this.idvtcIssuedChip = this.page
      .getByTestId('applicationBanner')
      .getByTestId('scoreChip')
      .filter({ hasText: 'Issued' });
    this.icsBanner = this.page.getByTestId('applicationBanner');
    this.icsCardChip = this.icsBanner.getByTestId('scoreChip');
    this.icsApplyButton = this.page.getByTestId('icsApplyButton');
    this.claimIcsAlert = this.page.getByTestId('claimIcsAlert');
    this.claimAlert = this.page.getByTestId('claimIdvtcAlert');
    this.claimAlertButton = this.claimAlert.getByRole('link', {
      name: 'Go to Claim page',
    });
    this.navClaimCounter = this.page
      .getByTestId('navItem')
      .filter({ hasText: 'Operator Type' })
      .getByTestId('navCounter');
    this.claimPageTitle = this.page
      .getByTestId('pageTitle')
      .locator('[aria-current="page"]');
  }

  async openTypePage() {
    await test.step('Open the Operator Type page', async () => {
      await this.openWithRetry('/type', this.typeHubRows.first());
    });
  }

  async openIcsOverviewPage() {
    await test.step('Open the ICS overview page', async () => {
      await this.openWithRetry('/type/ics-system', this.icsApplyButton);
    });
  }

  async openIdvtcOverviewPage() {
    await test.step('Open the IDVTC overview page', async () => {
      await this.openWithRetry(
        '/type/idvtc-description',
        this.idvtcApplyButton,
      );
    });
  }

  async openParametersPage() {
    await test.step('Open the Operator Type page', async () => {
      await this.openWithRetry('/type', this.pageTitle);
    });
  }
}
