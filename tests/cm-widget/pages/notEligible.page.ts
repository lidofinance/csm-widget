import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';

export class NotEligiblePage extends BasePage {
  notEligibleSection: Locator;
  disconnectBtn: Locator;
  notEligibleDetailedLink: Locator;

  tryCsmSection: Locator;
  joinCsmBtn: Locator;

  navigateCMv1Section: Locator;
  navigateToCMv1Btn: Locator;

  constructor(page: Page) {
    super(page);

    this.notEligibleSection = page.getByTestId('notEligibleSection');
    this.disconnectBtn = this.notEligibleSection.getByTestId('disconnectBtn');
    this.notEligibleDetailedLink = this.notEligibleSection.getByRole('link', {
      name: 'the link',
    });

    this.tryCsmSection = page.getByTestId('tryCsmSection');
    this.joinCsmBtn = this.tryCsmSection.getByRole('button', {
      name: 'Join CSM',
    });

    this.navigateCMv1Section = page.getByTestId('navigateCMv1Section');
    this.navigateToCMv1Btn =
      this.navigateCMv1Section.getByTestId('navigateToCMv1Btn');
  }
}
