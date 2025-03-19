import { Experience } from '../types';

export type ExperienceForm = {
  professional: 'on' | 'off';
  validatedBefore: 'on' | 'off';
  otherModules: 'on' | 'off';
  modules: 'curated' | 'sdvt' | 'both' | '';
  nameInModules?: string;
  otherValidatorsCount: number;
};

export const transformOutcoming = (data: ExperienceForm): Experience => ({
  professional: data.professional === 'on',
  validatedBefore: data.validatedBefore === 'on',
  fromCurated:
    data.otherModules === 'on' &&
    (data.modules === 'curated' || data.modules === 'both'),
  fromSDVT:
    data.otherModules === 'on' &&
    (data.modules === 'sdvt' || data.modules === 'both'),
  nameInModules: data.otherModules === 'on' ? data.nameInModules : '',
  otherValidatorsCount: data.otherValidatorsCount ?? 0,
});

export const transformIncoming = (data: Experience): ExperienceForm => ({
  ...data,
  professional: data.professional ? 'on' : 'off',
  validatedBefore: data.validatedBefore ? 'on' : 'off',
  otherModules: data.fromCurated || data.fromSDVT ? 'on' : 'off',
  modules:
    data.fromCurated && data.fromSDVT
      ? 'both'
      : data.fromCurated
        ? 'curated'
        : data.fromSDVT
          ? 'sdvt'
          : '',
});
