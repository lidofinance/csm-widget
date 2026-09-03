import { Locator, Page, test } from '@playwright/test';
import {
  PAGE_WAIT_TIMEOUT,
  RPC_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';

export class SelectOperatorModalElement {
  page: Page;
  modal: Locator;
  title: Locator;
  description: Locator;
  legendManager: Locator;
  legendRewards: Locator;
  rows: Locator;
  closeButton: Locator;
  settledState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByTestId('selectOperatorModal');
    this.title = this.modal.getByText('Select Node Operator');
    this.description = this.modal.getByTestId('selectOperatorDescription');
    this.legendManager = this.modal.getByTestId('selectOperatorLegendManager');
    this.legendRewards = this.modal.getByTestId('selectOperatorLegendRewards');
    this.rows = this.modal.getByTestId('selectModalOperatorRow');
    this.closeButton = this.modal.locator('button').first();
    this.settledState = this.page
      .getByTestId('connectBtn')
      .or(this.page.getByTestId('accountSectionHeader'))
      .or(this.rows)
      .first();
  }

  rowById(nodeOperatorId: number) {
    return this.rows.filter({
      has: this.page
        .getByTestId('descriptorId')
        .getByText(String(nodeOperatorId), { exact: true }),
    });
  }

  roleBadgesById(nodeOperatorId: number) {
    return this.rowById(nodeOperatorId).getByTestId('roleBadge');
  }

  async selectOperator(nodeOperatorId: number) {
    await test.step(`Select Node Operator #${nodeOperatorId}`, async () => {
      await this.rowById(nodeOperatorId).click();
      await this.modal.waitFor({ state: 'hidden', timeout: PAGE_WAIT_TIMEOUT });
    });
  }

  async clickCross() {
    await test.step('Close the prompt with the cross', async () => {
      await this.closeButton.click();
    });
  }

  async pressEscape() {
    await test.step('Close the prompt with Escape', async () => {
      await this.page.keyboard.press('Escape');
    });
  }

  async clickBackdrop() {
    await test.step('Close the prompt by clicking the backdrop', async () => {
      await this.page.mouse.click(32, 32);
    });
  }

  async forgetSelectionAndReload() {
    await test.step('Forget the cached Node Operator selection', async () => {
      await this.page.evaluate(() => {
        Object.keys(window.localStorage)
          .filter((key) => /^sm-\d+-no-0x/.test(key))
          .forEach((key) => window.localStorage.removeItem(key));
      });
      await this.page.reload();
      await this.settledState.waitFor({
        state: 'visible',
        timeout: RPC_WAIT_TIMEOUT,
      });
    });
  }

  async selectOperatorIfModalShown() {
    await test.step('Select a Node Operator if the modal is shown', async () => {
      await this.settledState
        .waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT })
        .catch(() => undefined);

      if (!(await this.rows.first().isVisible())) return;

      await this.rows.first().click();
      await this.modal.waitFor({ state: 'hidden', timeout: PAGE_WAIT_TIMEOUT });
    });
  }
}
