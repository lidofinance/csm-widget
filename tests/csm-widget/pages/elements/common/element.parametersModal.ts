import { Locator, Page } from '@playwright/test';

export class ParametersModal {
  page: Page;
  modal: Locator;
  showMoreToggle: Locator;
  foldableSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('div[role="dialog"]', {
      has: this.page.getByTestId('parametersShowMore'),
    });
    this.showMoreToggle = this.modal.getByTestId('parametersShowMore');
    this.foldableSection = this.modal.getByTestId('foldableParameters');
  }

  getParameter(title: string): Locator {
    return this.modal.getByTestId('parameterTitle').filter({ hasText: title });
  }

  getParameterTooltipIcon(title: string): Locator {
    return this.getParameter(title).getByTestId('iconTooltip');
  }

  getTooltipText(text: string): Locator {
    return this.page.getByText(text);
  }
}
