import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { CreateNodeOperatorForm } from './elements/keys/element.createNodeOperatorForm';
import { OperatorTypeCard } from './elements/main/element.operatorTypeCards';
import { RemovePage } from './tabs/keys/remove.page';
import { SubmitPage } from './tabs/keys/submit.page';
import { KeysViewPage } from './tabs/keys/keysView.page';

export class KeysPage extends BasePage {
  base: BasePage;

  // Own elements
  createNodeOperatorForm: CreateNodeOperatorForm;
  headerTitle: Locator;
  headerSubTitle: Locator;

  // Tabs
  removePage: RemovePage;
  submitPage: SubmitPage;
  keysView: KeysViewPage;

  constructor(page: Page) {
    super(page);
    this.base = new BasePage(page);
    this.removePage = new RemovePage(page);
    this.submitPage = new SubmitPage(page);
    this.keysView = new KeysViewPage(page);
    this.createNodeOperatorForm = new CreateNodeOperatorForm(this.page);
    this.headerTitle = this.pageTitle;
    this.headerSubTitle = this.page.getByText('Upload your first key(s)');
  }

  // `/create` is the type-selection page for wallets with 2+ creatable
  // types, so we go straight to the per-type route the test needs.
  async goto(type: OperatorTypeCard = '0x01') {
    await test.step(`Open the Keys page to create a new ${type} node operator`, async () => {
      await this.openWithRetry(
        `/create/${type}`,
        this.createNodeOperatorForm.formBlock,
      );
    });
  }

  async openSubmitPage() {
    await this.submitPage.open();
    return this.submitPage;
  }

  async openRemovePage() {
    await this.removePage.open();
    return this.removePage;
  }

  async isNewOperator() {
    await this.base.header.accountSection.waitFor({ state: 'visible' });
    return (
      (await this.headerTitle.isVisible()) &&
      (await this.headerSubTitle.isVisible())
    );
  }
}
