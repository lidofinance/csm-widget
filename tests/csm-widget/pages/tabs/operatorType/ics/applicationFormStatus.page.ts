import { Locator, Page } from '@playwright/test';

export class ApplicationFormStatus {
  page: Page;
  form: Locator;
  scoreChip: Locator;
  applicationSection: Locator;
  applicationInfo: Locator;
  viewBreakdownBtn: Locator;
  scoreBreakdownTotal: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;
  applyAgainBtn: Locator;

  //socials links
  twitterLinkInput: Locator;
  twitterLinkLabel: Locator;
  discordLinkInput: Locator;
  discordLinkLabel: Locator;

  // proof of
  totalScoreBreakdown: Locator;
  proofOfHumanityCollapse: Locator;
  proofOfExperienceCollapse: Locator;
  proofOfEngagementCollapse: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('applicationFormStatus');
    this.scoreChip = this.form.getByTestId('scoreChip');
    this.applicationSection = page.getByTestId('applicationSection');
    this.applicationInfo = this.form.getByTestId('applicationInfo');
    this.viewBreakdownBtn = this.form.getByRole('button', {
      name: 'View breakdown',
    });
    this.scoreBreakdownTotal = page.getByTestId('scoreBreakdownTotal');

    this.mainAddressInput = this.applicationSection.locator(
      'input[name="mainAddress"]',
    );
    this.mainAddressLabel = this.applicationSection.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );
    this.applyAgainBtn = this.form.getByRole('button', { name: 'Apply again' });
    // socials links
    this.twitterLinkInput = this.applicationSection.locator(
      'input[name="twitterLink"]',
    );
    this.twitterLinkLabel = this.applicationSection.locator(
      'xpath=//input[@name="twitterLink"]/ancestor::label',
    );
    this.discordLinkInput = this.applicationSection.locator(
      'input[name="discordLink"]',
    );
    this.discordLinkLabel = this.applicationSection.locator(
      'xpath=//input[@name="discordLink"]/ancestor::label',
    );
    // proof of
    this.totalScoreBreakdown = this.form.getByTestId('totalScoreBreakdown');
    this.proofOfHumanityCollapse = page.locator('#proofOfHumanity');
    this.proofOfExperienceCollapse = page.locator('#proofOfExperience');
    this.proofOfEngagementCollapse = page.locator('#proofOfEngagement');
  }
}
