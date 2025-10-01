import { Contact } from '../types';

export type ExperienceForm = {
  professional: 'on' | 'off';
  validatedBefore: 'on' | 'off';
  otherModules: 'on' | 'off';
  modules: 'curated' | 'sdvt' | 'both' | '';
  nameInModules?: string;
  otherValidatorsCount: number;
};

export const transformOutcoming = (data: Contact): Contact => ({
  ...data,
  discord: data.discord || undefined,
  telegram: data.telegram || undefined,
  twitter: data.twitter || undefined,
});
