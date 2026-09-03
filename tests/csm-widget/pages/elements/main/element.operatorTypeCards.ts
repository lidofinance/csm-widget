import { Locator, Page } from '@playwright/test';

export type OperatorTypeCard = '0x01' | 'ics' | 'idvtc' | '0x02';

export class OperatorTypeCards {
  page: Page;
  parametersDocsLink: Locator;

  csm01Card: Locator;
  icsCard: Locator;
  idvtcCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.parametersDocsLink = this.page.getByRole('link', {
      name: 'operator types and parameters',
    });

    this.csm01Card = this.getCard('0x01');
    this.icsCard = this.getCard('ics');
    this.idvtcCard = this.getCard('idvtc');
  }

  getCard(type: OperatorTypeCard): Locator {
    return this.page.getByTestId(`operatorTypeCard-${type}`);
  }

  getCardButton(type: OperatorTypeCard): Locator {
    return this.getCard(type).getByRole('button');
  }
}
