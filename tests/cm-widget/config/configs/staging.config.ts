// StagingConfig.ts
import { ProdConfig } from './prod.config';

export class StagingConfig extends ProdConfig {
  constructor() {
    super();
    this.standConfig = {
      ...this.standConfig,
      standType: 'staging',
      standUrl: 'https://csm.infra-staging.org',
    };
  }
}
