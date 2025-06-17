import { Locator, test } from '@playwright/test';

export abstract class BaseSection {
  expandedBlock: Locator;
  expandedButton: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  public abstract waitForExpanded(): Promise<void>;

  constructor(section: Locator, sectionTestId: string) {
    this.expandedBlock = section.getByTestId(sectionTestId);
    this.expandedButton = this.expandedBlock.getByRole('button');

    // Common Balance
    this.commonBalance = this.expandedBlock.getByTestId('commonBalance');
    this.commonBalance_Text = this.commonBalance.getByTestId('textContent');
    this.commonBalance_SubText =
      this.commonBalance.getByTestId('subtextContent');
  }

  async expand() {
    let isExpanded =
      (await this.expandedButton.getAttribute('aria-expanded')) === 'true';

    if (isExpanded) {
      console.info(`Section already expanded`);
      return;
    }

    const attempts = 5;

    for (let attempt = 1; attempt <= attempts && !isExpanded; attempt++) {
      await test.step(`Try to expand the "Available to claim" section. (Attempt: ${attempt})`, async () => {
        try {
          await this.expandedButton.click();
          await this.waitForExpanded();
          isExpanded = true;
          return;
        } catch {
          console.warn(`Waiting for expanded failed.`);
          if (attempt === attempts) {
            throw new Error(
              'Failed to expand "Available to claim" section after 5 attempts',
            );
          }
        }
      });
    }
  }
}
