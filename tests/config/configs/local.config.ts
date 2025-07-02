import { TestnetConfig } from './testnet.config';

export class LocalConfig extends TestnetConfig {
  constructor() {
    super();
    this.standConfig = {
      ...this.standConfig,
      standUrl: 'http://localhost:3000/',
    };
  }
}
