import { Page, test } from '@playwright/test';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { BasePage } from '../../shared/pages/base.page';
import { WelcomeSection } from './elements/common/element.welcomeSection';

export class WelcomePage extends BasePage {
  welcomeSection: WelcomeSection;
  constructor(page: Page) {
    super(page);
    this.welcomeSection = new WelcomeSection(page);
  }

  async goto(param = '') {
    await test.step('Open the Welcome page', async () => {
      await this.page.goto(param);
    });
    await this.waitForLoaded();
  }

  async waitForLoaded() {
    await test.step('Wait for the Welcome page to load', async () => {
      await this.welcomeSection.loader.waitFor({
        state: 'detached',
        timeout: RPC_WAIT_TIMEOUT,
      });
    });
  }
}
