import { Page, Locator } from '@playwright/test';

export class RolesModal {
  modal: Locator;
  closeButton: Locator;
  continueButton: Locator;
  headings: Locator;
  paragraphs: Locator;

  constructor(private page: Page) {
    this.modal = this.page.locator('#lido-ui-modal-root [role="dialog"]');
    this.closeButton = this.modal.locator('button[type="button"]').first();
    this.continueButton = this.modal.getByRole('button', {
      name: 'Continue',
    });
    this.headings = this.modal.locator('h5');
    this.paragraphs = this.modal.locator('p');
  }
}
