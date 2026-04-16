export * from './configFactory';
// eslint-disable-next-line import/no-extraneous-dependencies
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());

import { IConfig } from './configs/base.config';
import { ConfigFactory } from '.';

export const widgetFullConfig: IConfig = ConfigFactory.createConfig(
  process.env.STAND_TYPE,
);
