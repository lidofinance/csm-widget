import { Page, Locator } from '@playwright/test';

export class RolesModal {
  modal: Locator;
  closeButton: Locator;
  continueButton: Locator;
  headings: Locator;
  paragraphs: Locator;

  constructor(private page: Page) {
    this.modal = this.page.getByTestId('confirmChangeRoleModal');
    this.closeButton = this.modal.getByRole('button', { name: 'Close' });
    this.continueButton = this.modal.getByRole('button', {
      name: 'Continue',
    });
    this.headings = this.modal.getByTestId('changeRoleModalTitle');
    this.paragraphs = this.modal.getByTestId('changeRoleModalText');
  }
}
