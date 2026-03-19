import { Page } from '@playwright/test';
import { Header } from './common/element.header';
import { ConnectWalletModal } from './common/element.connectWalletModal';
import { CreateNodeOperatorForm } from './keys/element.createNodeOperatorForm';
import { TermAndPrivacy } from './common/element.termAndPrivacy';

export class ElementController {
  page: Page;
  header: Header;
  connectWalletModal: ConnectWalletModal;
  termAndPrivacy: TermAndPrivacy;
  createNodeOperatorForm: CreateNodeOperatorForm;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(this.page);
    this.connectWalletModal = new ConnectWalletModal(this.page);
    this.termAndPrivacy = new TermAndPrivacy(this.page);
    this.createNodeOperatorForm = new CreateNodeOperatorForm(this.page);
  }
}
