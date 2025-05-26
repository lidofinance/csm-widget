import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { CreateNodeOperatorForm } from './elements/keys/element.createNodeOperatorForm';
import { RemovePage } from './remove.page';
import { SubmitPage } from './submit.page';
import { KeysViewPage } from './keysView.page';

export class KeysPage extends BasePage {
  base: BasePage;
  createNodeOperatorForm: CreateNodeOperatorForm;
  headerTitle: Locator;
  headerSubTitle: Locator;
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
    this.headerTitle = this.page.getByText('Create a Node Operator');
    this.headerSubTitle = this.page.getByText('Upload your first key(s)');
  }

  async goto() {
    await test.step('Open the Keys page to create new node operator', async () => {
      await this.page.goto('/create');
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
    return (
      (await this.headerTitle.isVisible()) &&
      (await this.headerSubTitle.isVisible())
    );
  }
}
