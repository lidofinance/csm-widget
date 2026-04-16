import { IConfig } from './configs/base.config';
import { LocalConfig } from './configs/local.config';
import { PreviewConfig } from './configs/preview.config';
import { ProdConfig } from './configs/prod.config';
import { StagingConfig } from './configs/staging.config';
import { TestnetConfig } from './configs/testnet.config';

export class ConfigFactory {
  private static instance: IConfig | null = null;

  // TODO: make it required arg
  public static createConfig(standType?: string): IConfig {
    if (ConfigFactory.instance) {
      return ConfigFactory.instance;
    }

    let config: IConfig;

    switch (standType) {
      case 'prod':
        config = new ProdConfig();
        break;
      case 'staging':
        config = new StagingConfig();
        break;
      case 'testnet':
        config = new TestnetConfig();
        break;
      case 'preview':
        config = new PreviewConfig();
        break;
      case 'local':
        config = new LocalConfig();
        break;
      default:
        throw new Error(`Unknown stand type: ${standType}`);
    }

    // ConfigSchema.parse(config);
    ConfigFactory.instance = config;
    return config;
  }
}
