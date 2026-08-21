import { Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { StarterPackSection } from './elements/main/element.starterPackSection';
import { OperatorTypeModal } from './elements/main/element.operatorTypeModal';

export class MainPage extends BasePage {
  starterPackSection: StarterPackSection;
  operatorTypeModal: OperatorTypeModal;

  constructor(page: Page) {
    super(page);
    this.starterPackSection = new StarterPackSection(this.page);
    this.operatorTypeModal = new OperatorTypeModal(this.page);
  }

  async goto() {
    await test.step('Open the Main page', async () => {
      await this.openWithRetry(
        '/',
        this.starterPackSection.createNodeOperatorBtn,
      );
    });
  }

  async openOperatorTypeModal() {
    await test.step('Open the operator type modal', async () => {
      await this.goto();
      await this.starterPackSection.createNodeOperatorBtn.click();
      await this.operatorTypeModal.modal.waitFor({ state: 'visible' });
    });
  }

  async isNewOperator() {
    return this.starterPackSection.section.isVisible();
  }
}
