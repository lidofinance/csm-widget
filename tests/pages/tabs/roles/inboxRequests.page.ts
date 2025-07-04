import { Page, test } from '@playwright/test';

export class InboxRequestsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await test.step('Open Inbox Requests tab', async () => {
      await this.page.goto('/roles/inbox');
    });
  }
}
