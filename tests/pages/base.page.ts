import { Locator, Page, test } from '@playwright/test';
import { Header } from './elements/common/element.header';
import {
  RPC_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { ConnectWalletModal } from './elements/common/element.connectWalletModal';
import { waitForCallback } from 'tests/helpers/tests';

export class BasePage {
  page: Page;
  header: Header;
  connectWalletModal: ConnectWalletModal;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(this.page);
    this.connectWalletModal = new ConnectWalletModal(this.page);
  }

  async getClipboardText() {
    return String(await this.page.evaluate('navigator.clipboard.readText()'));
  }

  async openWithRetry(
    url: string,
    textLocatorForWaiting: Locator | Locator[],
    attempt = 1,
  ): Promise<void> {
    try {
      await this.page.goto(url);

      await test.step('Wait for balance to load', async () => {
        if (Array.isArray(textLocatorForWaiting)) {
          for (const locator of textLocatorForWaiting) {
            await this.waitForTextContent(locator, 180000);
          }
        } else {
          await this.waitForTextContent(
            textLocatorForWaiting,
            WALLET_PAGE_TIMEOUT_WAITER,
          );
        }
      });
    } catch (e) {
      if (attempt >= 2) throw e;
      console.warn(`Open attempt ${attempt} failed. Retrying...`);
      return this.openWithRetry(url, textLocatorForWaiting, attempt + 1);
    }
  }

  async getCookie(name: string) {
    const cookies = await this.page.context().cookies();
    return cookies.find((cookie) => cookie.name === name);
  }

  async getStorageData(name: string | string[]) {
    return test.step(`Get data from Local Storage by key '${name}'`, async () => {
      return this.page.evaluate((names) => {
        if (Array.isArray(names)) {
          return names.map((name) => localStorage.getItem(name));
        } else {
          return localStorage.getItem(names);
        }
      }, name);
    });
  }

  async getSessionStorageData(name: string | string[]) {
    return test.step(`Get data from Session Storage by key '${name}'`, async () => {
      return this.page.evaluate((names) => {
        if (Array.isArray(names)) {
          return names.map((name) => sessionStorage.getItem(name));
        } else {
          return sessionStorage.getItem(names);
        }
      }, name);
    });
  }

  async removeKeyFromSessionStorage(name: string) {
    await this.page.evaluate((key) => {
      sessionStorage.removeItem(key);
    }, name);
  }

  async waitForTextContent(locator: Locator, timeout = RPC_WAIT_TIMEOUT) {
    return waitForCallback(
      async (locator: Locator) => {
        const text = await locator.evaluate((element) => {
          const text = element.textContent?.trim();
          return text && text.length > 0 && text != ' ' ? text : null;
        }, timeout);
        return text || null;
      },
      locator,
      timeout,
    );
  }

  async waitForTextContentToBeEmpty(locator: Locator) {
    return await locator.evaluate(async (element) => {
      return new Promise<string>((resolve) => {
        const checkText = () => {
          const text = element.textContent?.trim();
          if (text && text.length === 0) {
            resolve(text);
          } else {
            requestAnimationFrame(checkText);
          }
        };
        requestAnimationFrame(checkText);
      });
    });
  }

  async waitForPage(timeout = RPC_WAIT_TIMEOUT) {
    const page = await this.page
      .context()
      .waitForEvent('page', { timeout: timeout });
    await page.waitForLoadState('load');
    return page;
  }

  async allowUseCookies() {
    await test.step('Allow use cookies (if available)', async () => {
      if (
        await this.page
          .getByRole('button')
          .getByText('Allow')
          .isVisible({ timeout: 3000 })
      ) {
        await this.page.getByRole('button').getByText('Allow').click();
      }
    });
  }

  async declineUseCookies() {
    await this.page.getByRole('button').getByText('Decline').click();
  }

  async getWebsiteTitle() {
    return await this.page.title();
  }

  async getPageTitle() {
    return this.page.locator('main >> h1').textContent();
  }

  async getPageSubTittle() {
    return this.page.locator('main >> h4').textContent();
  }

  async closeModalWindow() {
    await test.step('Close modal window', async () => {
      await this.page.mouse.click(32, 32);
    });
  }

  async closeTooltip() {
    await this.page.mouse.move(0, 0);
  }

  async getHoveredContent(timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = await this.page.evaluate(() => {
        return (
          document.querySelectorAll('#lido-ui-modal-root div[data-placement]')
            .length === 1
        );
      });
      if (result) {
        break;
      }
    }
    return this.page.locator('#lido-ui-modal-root');
  }

  async hoverElement(element: Locator) {
    await element.hover();
    return this.waitForTextContent(await this.getHoveredContent());
  }
}
