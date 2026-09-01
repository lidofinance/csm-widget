import { Locator, Page } from '@playwright/test';

export type OperatorTypeCard = 'def' | 'ics' | 'idvtc' | '0x02';

export class OperatorTypeModal {
  page: Page;
  modal: Locator;
  title: Locator;
  parametersDocsLink: Locator;

  defCard: Locator;
  icsCard: Locator;
  idvtcCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('div[role="dialog"]', {
      hasText: 'Choose operator type',
    });
    this.title = this.modal.getByText('Choose operator type');
    this.parametersDocsLink = this.modal.getByRole('link', {
      name: 'operator types and parameters',
    });

    this.defCard = this.getCard('def');
    this.icsCard = this.getCard('ics');
    this.idvtcCard = this.getCard('idvtc');
  }

  getCard(type: OperatorTypeCard): Locator {
    return this.modal.getByTestId(`operatorTypeCard-${type}`);
  }

  getCardButton(type: OperatorTypeCard): Locator {
    return this.getCard(type).getByRole('button');
  }
}
