import { Locator, Page, test } from '@playwright/test';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class FaqItemElement {
  root: Locator;
  title: Locator;
  // app-ui Accordion renders no testids: the summary is the element that
  // controls the collapsible region, the region holds the answer
  toggle: Locator;
  content: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = this.root.getByTestId('faqItemTitle');
    this.toggle = this.root.locator('[aria-controls]').first();
    this.content = this.root.locator('[role="region"]').first();
  }

  getLink(name: string) {
    return this.content.getByRole('link', { name }).first();
  }

  async isExpanded() {
    return (await this.toggle.getAttribute('aria-expanded')) === 'true';
  }

  async expand() {
    await test.step('Expand FAQ section', async () => {
      if (!(await this.isExpanded())) await this.toggle.click();
    });
  }

  async collapse() {
    await test.step('Collapse FAQ section', async () => {
      if (await this.isExpanded()) await this.toggle.click();
    });
  }
}

export class FaqElement {
  page: Page;
  button: Locator;
  closeButton: Locator;
  root: Locator;
  items: Locator;
  titles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.button = this.page.getByTestId('faqButton');
    this.closeButton = this.page.getByTestId('faqClose');
    this.root = this.page.getByTestId('faqSection');
    this.items = this.root.getByTestId('faqItem');
    this.titles = this.items.getByTestId('faqItemTitle');
  }

  getItem(title: string) {
    return new FaqItemElement(
      this.items.filter({
        has: this.page.getByTestId('faqItemTitle').filter({ hasText: title }),
      }),
    );
  }

  async open() {
    await test.step('Open FAQ drawer', async () => {
      if (!(await this.root.isVisible())) await this.button.click();
      await this.root.waitFor({ state: 'visible' });
    });
  }

  async close() {
    await test.step('Close FAQ drawer', async () => {
      await this.closeButton.click();
      await this.root.waitFor({ state: 'hidden' });
    });
  }

  async waitForVisible() {
    await test.step('Wait for FAQ', async () => {
      await this.button.waitFor({
        state: 'visible',
        timeout: RPC_WAIT_TIMEOUT,
      });
      await this.open();
    });
  }
}
