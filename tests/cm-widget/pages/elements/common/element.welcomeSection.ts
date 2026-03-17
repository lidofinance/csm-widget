import { Locator, Page } from '@playwright/test';

export class WelcomeSection {
  page: Page;
  welcomeSection: Locator;
  navigateCMv1Section: Locator;
  connectWallet: Locator;
  navigateToCMv1Btn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeSection = this.page.getByTestId('welcomeSection');
    this.connectWallet = this.welcomeSection.getByTestId('connectWallet');

    this.navigateCMv1Section = this.page.getByTestId('navigateCMv1Section');
    this.navigateToCMv1Btn =
      this.navigateCMv1Section.getByTestId('navigateToCMv1Btn');
  }
}
