import { Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { RemovePage } from './tabs/keys/remove.page';
import { SubmitPage } from './tabs/keys/submit.page';
import { KeysViewPage } from './tabs/keys/keysView.page';

export class KeysPage extends BasePage {
  base: BasePage;

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
  }

  async openSubmitPage() {
    await this.submitPage.open();
    return this.submitPage;
  }

  async openRemovePage() {
    await this.removePage.open();
    return this.removePage;
  }
}
