/* eslint-disable no-empty-pattern */
import { test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';

/**
 * Mirrors Playwright tags into Qase tags.
 */
export const reportTagsToQase = async (
  {},
  use: (value: void) => Promise<void>,
) => {
  const tags = test.info().tags.map((tag) => tag.replace(/^@/, ''));
  if (tags.length > 0) qase.tags(...tags);
  await use();
};
