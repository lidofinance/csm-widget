import { Locator, Page, test } from '@playwright/test';
import { Header } from './elements/common/element.header';
import { COMMON_ACTION_TIMEOUT, RPC_WAIT_TIMEOUT } from 'tests/consts/timeouts';
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
    textLocatorForWaiting: Locator,
    attempt = 1,
  ): Promise<void> {
    try {
      // TODO: Remove debug logging after test stability is confirmed
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] openWithRetry: Attempt ${attempt} - navigating to ${url}`,
      );
      await this.page.goto(url, { waitUntil: 'networkidle' });
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] openWithRetry: Page loaded with networkidle`);

      await test.step('Wait for balance to load', async () => {
        // eslint-disable-next-line no-console
        console.log(
          `[DEBUG] openWithRetry: Waiting for text content to load...`,
        );
        await this.waitForTextContent(
          textLocatorForWaiting,
          COMMON_ACTION_TIMEOUT,
        );
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] openWithRetry: Text content loaded successfully`);
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] openWithRetry: Attempt ${attempt} failed:`,
        errorMessage,
      );
      if (attempt >= 2) {
        // eslint-disable-next-line no-console
        console.error(
          `[DEBUG] openWithRetry: Max retries reached, throwing error`,
        );
        throw e;
      }
      // eslint-disable-next-line no-console
      console.warn(`[DEBUG] openWithRetry: Retrying attempt ${attempt + 1}...`);
      return this.openWithRetry(url, textLocatorForWaiting, attempt + 1);
    }
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
    return waitForCallback(
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

  async waitForPage(timeout = 20000) {
    // eslint-disable-next-line no-console
    console.log(
      `[DEBUG] waitForPage: Starting to wait for new page event, timeout: ${timeout}ms`,
    );

    try {
      const page = await this.page
        .context()
        .waitForEvent('page', { timeout: timeout });
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] waitForPage: New page event received, URL: ${page.url()}`,
      );

      // eslint-disable-next-line no-console
      console.log(`[DEBUG] waitForPage: Waiting for domcontentloaded...`);
      await page.waitForLoadState('domcontentloaded');
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] waitForPage: Page fully loaded`);

      return page;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] waitForPage: Failed to wait for page:`,
        errorMessage,
      );
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] waitForPage: Current page URL: ${this.page.url()}`,
      );
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] waitForPage: Number of open pages: ${this.page.context().pages().length}`,
      );
      throw error;
    }
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

  async waitForFormReady(formSelector = '[data-testid="submitKeysForm"]') {
    await test.step('Wait for form to be ready', async () => {
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] waitForFormReady: Starting form readiness check for selector: ${formSelector}`,
      );

      // Wait for form to be visible
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] waitForFormReady: Waiting for form to be visible...`,
      );
      await this.page.waitForSelector(formSelector, { state: 'visible' });
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] waitForFormReady: Form is now visible`);

      // Wait for network to be idle (all API calls completed)
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] waitForFormReady: Waiting for network to be idle...`,
      );
      await this.page.waitForLoadState('networkidle');
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] waitForFormReady: Network is now idle`);

      // Wait for token buttons to have values (form initialization complete)
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] waitForFormReady: Waiting for token buttons to be initialized...`,
      );
      await this.page.waitForFunction(
        () => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const inputs = document.querySelectorAll(
            'input[type="radio"]',
          ) as NodeListOf<HTMLInputElement>;
          const inputCount = inputs.length;
          const inputsWithValues = Array.from(inputs).filter(
            (input) => input.value,
          ).length;

          // eslint-disable-next-line no-console
          console.log(
            `[DEBUG] Found ${inputCount} radio inputs, ${inputsWithValues} have values`,
          );
          if (inputCount > 0) {
            Array.from(inputs).forEach((input, index) => {
              // eslint-disable-next-line no-console
              console.log(
                `[DEBUG] Input ${index}: value="${input.value}", name="${input.name}"`,
              );
            });
          }

          return inputCount > 0 && inputsWithValues === inputCount;
        },
        { timeout: 10000 },
      );

      // eslint-disable-next-line no-console
      console.log(`[DEBUG] waitForFormReady: Form is fully ready`);
    });
  }

  async getPageSubTittle() {
    return this.page.locator('main >> h4').textContent();
  }

  async captureDebugScreenshot(testName: string, step: string) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `debug-${testName}-${step}-${timestamp}.png`;
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] Capturing screenshot: ${filename}`);

      await this.page.screenshot({
        path: `test-results/${filename}`,
        fullPage: true,
      });

      // Also capture page info for debugging
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] Current URL: ${this.page.url()}`);
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] Page title: ${await this.page.title()}`);

      // Log any console errors from the page
      const consoleMessages: string[] = await this.page.evaluate(() => {
        const messages: string[] = [];
        // Note: We're not actually capturing runtime console messages here,
        // just showing the pattern. For real console capture, use page.on('console')
        return messages;
      });

      if (consoleMessages.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] Page console messages:`, consoleMessages);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] Failed to capture screenshot:`,
        error instanceof Error ? error.message : error,
      );
    }
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
