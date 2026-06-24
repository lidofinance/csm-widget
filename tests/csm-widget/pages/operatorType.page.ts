import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { TxModal } from './elements/common/element.txProgressModal';
import { ApplicationForm } from './tabs/operatorType/ics/applicationForm.page';
import { DvtApplicationForm } from './tabs/operatorType/idvtc/dvtApplicationForm.page';

export class OperatorTypePage extends BasePage {
  applicationForm: ApplicationForm;
  dvtApplicationForm: DvtApplicationForm;
  txModal: TxModal;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.applicationForm = new ApplicationForm(page, walletPage);
    this.dvtApplicationForm = new DvtApplicationForm(page, walletPage);
    this.txModal = new TxModal(page);
  }
}
