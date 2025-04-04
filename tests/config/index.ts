export * from './configFactory';
import { config as envConfig } from 'dotenv';
envConfig();

import { IConfig } from 'tests/config/configs/base.config';
import { ConfigFactory } from 'tests/config';

export const widgetFullConfig: IConfig = ConfigFactory.createConfig(
  process.env.STAND_TYPE,
);
