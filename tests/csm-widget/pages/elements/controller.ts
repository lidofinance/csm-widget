import { Page } from '@playwright/test';
import { Header } from './common/element.header';
import { TermAndPrivacy } from './common/element.termAndPrivacy';
import { ConnectWalletModal } from './common/element.connectWalletModal';
import { StarterPackSection } from './main/element.starterPackSection';
import { CreateNodeOperatorForm } from './keys/element.createNodeOperatorForm';

export class ElementController {
  page: Page;
  header: Header;
  connectWalletModal: ConnectWalletModal;
  termAndPrivacy: TermAndPrivacy;
  starterPackSection: StarterPackSection;
  createNodeOperatorForm: CreateNodeOperatorForm;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(this.page);
    this.connectWalletModal = new ConnectWalletModal(this.page);
    this.termAndPrivacy = new TermAndPrivacy(this.page);
    this.starterPackSection = new StarterPackSection(this.page);
    this.createNodeOperatorForm = new CreateNodeOperatorForm(this.page);
  }
}
