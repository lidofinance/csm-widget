import { TestnetConfig } from './testnet.config';

export class PreviewConfig extends TestnetConfig {
  constructor() {
    super();
    if (!process.env.PREVIEW_STAND_URL) {
      throw new Error('Env variable PREVIEW_STAND_URL not specified.');
    }
    this.standConfig = {
      ...this.standConfig,
      standUrl: process.env.PREVIEW_STAND_URL,
    };
  }
}
