import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import {
  RewardsAddressPage,
  ManagerAddressPage,
  InboxRequestsPage,
} from './tabs/roles';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { RolesModal } from './elements/roles/rolesModal.element';
import { TxModal } from './elements/common/element.txProgressModal';

export class SettingsPage extends BasePage {
  rewardsAddressPage: RewardsAddressPage;
  managerAddressPage: ManagerAddressPage;
  inboxRequestsPage: InboxRequestsPage;
  modalRoot: RolesModal;
  txModal: TxModal;

  constructor(page: Page, walletPage: WalletPage) {
    super(page);
    this.rewardsAddressPage = new RewardsAddressPage(this.page, walletPage);
    this.managerAddressPage = new ManagerAddressPage(this.page, walletPage);
    this.inboxRequestsPage = new InboxRequestsPage(this.page, walletPage);
    this.modalRoot = new RolesModal(this.page);
    this.txModal = new TxModal(this.page);
  }
}
