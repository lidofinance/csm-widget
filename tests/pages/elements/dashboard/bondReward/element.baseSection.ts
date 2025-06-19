import { Locator, test } from '@playwright/test';

export abstract class BaseExpandedBlock {
  sectionTestId: string;
  expandedBlock: Locator;
  expandedButton: Locator;
  commonBalance: Locator;
  commonBalance_Text: Locator;
  commonBalance_SubText: Locator;

  public abstract waitForExpanded(): Promise<void>;

  constructor(section: Locator, sectionTestId: string) {
    this.sectionTestId = sectionTestId;
    this.expandedBlock = section.getByTestId(this.sectionTestId);
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
      console.info(`Section ${this.sectionTestId} already expanded`);
      return;
    }

    const attempts = 5;
    await test.step(`Expand the "${this.sectionTestId}" section.`, async () => {
      for (let attempt = 1; attempt <= attempts && !isExpanded; attempt++) {
        try {
          await this.expandedButton.click();
          await this.waitForExpanded();
          isExpanded = true;
          return;
        } catch {
          console.warn(`Waiting for expanded failed.`);
          if (attempt === attempts) {
            throw new Error(
              `Failed to expand "${this.sectionTestId}" section after 5 attempts`,
            );
          }
        }
      }
    });
  }
}
