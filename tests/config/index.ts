export * from './configFactory';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());

import { IConfig } from 'tests/config/configs/base.config';
import { ConfigFactory } from 'tests/config';

export const widgetFullConfig: IConfig = ConfigFactory.createConfig(
  process.env.STAND_TYPE,
);
