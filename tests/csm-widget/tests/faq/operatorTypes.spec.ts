import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { FAQ_OPERATOR_TYPES } from 'tests/csm-widget/consts/faq.const';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(...suite({ epic: EPIC.faq, story: 'Operator types' }), () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.operatorType.openParametersPage();
    await widgetService.faq.waitForVisible();
  });

  test(
    qase(630, 'Should show sections in order'),
    async ({ widgetService }) => {
      const { faq } = widgetService;

      await test.step('Check section titles', async () => {
        await expect(faq.titles).toHaveCount(FAQ_OPERATOR_TYPES.length);
        await expect(faq.titles).toContainText(
          FAQ_OPERATOR_TYPES.map((s) => s.title),
        );
      });

      await test.step('Check only the first section is expanded', async () => {
        for (const [index, section] of FAQ_OPERATOR_TYPES.entries()) {
          await expect(
            faq.getItem(section.title).toggle,
            `"${section.title}" expanded state`,
          ).toHaveAttribute('aria-expanded', String(index === 0));
        }
      });
    },
  );

  FAQ_OPERATOR_TYPES.forEach((section) => {
    test(
      qase(section.qaseId, `Should show "${section.title}" answer`),
      async ({ widgetService }) => {
        const item = widgetService.faq.getItem(section.title);

        await item.expand();

        await test.step('Check section is expanded', async () => {
          await expect(item.toggle).toHaveAttribute('aria-expanded', 'true');
          await expect(item.content).toBeVisible();
        });

        await test.step('Check answer text', async () => {
          // innerText keeps a break between paragraphs, textContent glues them
          await expect.soft(item.content).toHaveText(section.text, {
            useInnerText: true,
          });
        });

        await test.step('Check links', async () => {
          for (const { name, url } of section.links) {
            await expect(item.getLink(name), `"${name}" link`).toHaveAttribute(
              'href',
              url,
            );
          }
        });

        await item.collapse();

        await test.step('Check section is collapsed', async () => {
          await expect(item.toggle).toHaveAttribute('aria-expanded', 'false');
          await expect(item.content).not.toBeVisible();
        });
      },
    );
  });
});
