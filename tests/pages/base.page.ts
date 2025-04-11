import { Locator, Page, test } from '@playwright/test';
import { Header } from './elements/common/element.header';
import { RPC_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { ConnectWalletModal } from './elements/common/element.connectWalletModal';

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

  async getCookie(name: string) {
    const cookies = await this.page.context().cookies();
    return cookies.find((cookie) => cookie.name === name);
  }

  async getStorageData(name: string | string[]) {
    return await this.page.evaluate((names) => {
      if (Array.isArray(names)) {
        return names.map((name) => localStorage.getItem(name));
      } else {
        return localStorage.getItem(names);
      }
    }, name);
  }

  async waitForTextContent(locator: Locator, timeout = RPC_WAIT_TIMEOUT) {
    return await this.waitForCallback(
      async (locator: Locator) => {
        const text = await locator.evaluate((element) => {
          const text = element.textContent?.trim();
          return text && text.length > 0 && text != ' ' ? text : null;
        });
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
    await this.waitForTextContent(await this.getHoveredContent());
  }

  /**
   * Repeatedly calls an asynchronous callback function with the specified arguments until it returns a truthy value
   * or the timeout is reached.
   *
   * @param callback - An asynchronous function that takes arguments of type T and returns a promise.
   * @param args - The arguments to pass to the callback function.
   * @param timeout - The maximum amount of time (in milliseconds) to wait for the callback to return a truthy value.
   * @returns A promise that resolves with the callback's result if it returns a truthy value within the timeout.
   * @throws An error if the timeout is reached before the callback returns a truthy value.
   *
   * @template T - The type of the arguments to be passed to the callback function.
   */
  async waitForCallback<T>(
    callback: (args: T) => Promise<any>,
    args: T,
    timeout: number,
  ): Promise<any> {
    let shouldTerminate = false;
    setTimeout(() => {
      shouldTerminate = true;
    }, timeout);

    let result;
    while (!shouldTerminate) {
      result = await callback(args).catch(() => {
        console.error('Callback failed');
      });
      if (result) return result;
    }

    throw new Error(
      `callback still not done after ${
        timeout / 1000
      } sec.\nCallback result: ${result}`,
    );
  }
}
