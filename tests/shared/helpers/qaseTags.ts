/* eslint-disable no-empty-pattern */
import { test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';

/**
 * Mirrors Playwright tags into Qase tags.
 *
 * The reporter never looks at `test.tags` — it only picks up what was passed
 * to `qase.tags()` — so without this the tags used for grep filtering
 * (`{ tag: [Tags.smoke] }`) stay invisible in Qase. Tags inherited from
 * `describe` are included; the leading `@` is dropped.
 *
 * The empty destructuring pattern is required: Playwright rejects a fixture
 * whose first argument is a plain identifier.
 *
 * Runtime by nature: a test skipped before its body runs reports no tags.
 */
export const reportTagsToQase = async (
  {},
  use: (value: void) => Promise<void>,
) => {
  const tags = test.info().tags.map((tag) => tag.replace(/^@/, ''));
  if (tags.length > 0) qase.tags(...tags);
  await use();
};
