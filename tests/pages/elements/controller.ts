import { Page } from '@playwright/test';
import { Header } from '../header.page';
import { TermAndPrivacy } from './common/element.termAndPrivacy';
import { ConnectWalletModal } from './common/element.connectWalletModal';

export class ElementController {
  page: Page;
  header: Header;
  connectWalletModal: ConnectWalletModal;
  termAndPrivacy: TermAndPrivacy;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(this.page);
    this.connectWalletModal = new ConnectWalletModal(this.page);
    this.termAndPrivacy = new TermAndPrivacy(this.page);
  }
}
