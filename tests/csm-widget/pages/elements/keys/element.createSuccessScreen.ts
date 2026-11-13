import { Locator, Page, expect, test } from '@playwright/test';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class CreateSuccessScreen {
  page: Page;
  root: Locator;
  title: Locator;
  operatorId: Locator;
  switchToOperatorBtn: Locator;
  viewKeysBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = this.page.getByTestId('successScreen');
    this.title = this.root.getByText('Congratulations!');
    this.operatorId = this.root.getByTestId('createdOperatorId');
    this.switchToOperatorBtn = this.root.getByTestId('switchToOperatorBtn');
    this.viewKeysBtn = this.root.getByTestId('viewKeysBtn');
  }

  async waitForVisible() {
    await test.step('Wait for the create success screen', async () => {
      await expect(this.title).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
    });
  }

  async getOperatorId(): Promise<number> {
    const text = await this.operatorId.innerText();
    const match = text.match(/#(\d+)/);
    expect(
      match,
      `success stats must name the operator, got: ${text}`,
    ).not.toBeNull();
    return Number(match?.[1]);
  }
}
