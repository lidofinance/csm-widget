import { expect } from '@playwright/test';
import {
  checkExternalMatomoLink,
  fullUrlWithAnchorPattern,
} from 'tests/shared/helpers/matomoLinks';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

const OPERATOR_ROLES_DOCS_URL =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/operator-roles';
const EXTENDED_MODE_ANCHOR = '#extended-mode';
const EXTENDED_MODE_DOCS_URL = `${OPERATOR_ROLES_DOCS_URL}${EXTENDED_MODE_ANCHOR}`;
const EXTENDED_MODE_DOCS_PATTERN = fullUrlWithAnchorPattern(
  OPERATOR_ROLES_DOCS_URL,
  EXTENDED_MODE_ANCHOR,
);

test.describe('Operator without keys. Custom addresses.', () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.keysPage.goto();
  });

  test('Should send Matomo events and open docs from both help links', async ({
    widgetService,
  }) => {
    const form = widgetService.keysPage.createNodeOperatorForm;

    await test.step('Help links are hidden while the section is collapsed', async () => {
      await expect(form.customAddressDescriptionLink).toBeHidden();
      await expect(form.managerAddressPermissionTypeLink).toBeHidden();
    });

    await test.step('Expand the custom addresses section', async () => {
      await form.specifyCustomAdresses.click();
      await expect(form.customAddressDescriptionLink).toBeVisible();
      await expect(form.managerAddressPermissionTypeLink).toBeVisible();
    });

    await test.step('Both links point to the extended mode docs', async () => {
      await expect(form.customAddressDescriptionLink).toHaveAttribute(
        'href',
        EXTENDED_MODE_DOCS_URL,
      );
      await expect(form.managerAddressPermissionTypeLink).toHaveAttribute(
        'href',
        EXTENDED_MODE_DOCS_URL,
      );
    });

    await checkExternalMatomoLink(widgetService.page, matomoEventService, {
      name: 'detailed description of this feature',
      link: form.customAddressDescriptionLink,
      event: 'csm_widget_custom_address_description_link',
      url: EXTENDED_MODE_DOCS_PATTERN,
    });

    await checkExternalMatomoLink(widgetService.page, matomoEventService, {
      name: 'detailed explanation of the options',
      link: form.managerAddressPermissionTypeLink,
      event: 'csm_widget_manager_address_permission_type_link',
      url: EXTENDED_MODE_DOCS_PATTERN,
    });
  });
});
