import { Locator, Page } from '@playwright/test';

export class WelcomeSection {
  page: Page;
  welcomeSection: Locator;
  iAmANodeOperatorBtn: Locator;
  becomeANodeOperatorBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeSection = this.page.getByTestId('welcomeSection');
    this.iAmANodeOperatorBtn = this.welcomeSection.getByTestId(
      'iAmANodeOperatorBtn',
    );
    this.becomeANodeOperatorBtn = this.welcomeSection.getByTestId(
      'becomeANodeOperatorBtn',
    );
  }
}
