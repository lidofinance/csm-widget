import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  RewardsAddressPage,
  ManagerAddressPage,
  InboxRequestsPage,
} from './tabs/roles';
import { WalletPage, WalletTypes } from '@lidofinance/wallets-testing-wallets';
import { RolesModal } from './elements/roles/rolesModal.element';
import { TxModal } from './elements/common/element.txProgressModal';

export class RolesPage extends BasePage {
  rewardsAddressPage: RewardsAddressPage;
  managerAddressPage: ManagerAddressPage;
  inboxRequestsPage: InboxRequestsPage;
  modalRoot: RolesModal;
  txModal: TxModal;

  constructor(page: Page, walletPage: WalletPage<WalletTypes>) {
    super(page);
    this.rewardsAddressPage = new RewardsAddressPage(this.page, walletPage);
    this.managerAddressPage = new ManagerAddressPage(this.page);
    this.inboxRequestsPage = new InboxRequestsPage(this.page);
    this.modalRoot = new RolesModal(this.page);
    this.txModal = new TxModal(this.page);
  }
}
