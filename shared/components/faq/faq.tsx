import { FC } from 'react';
import { useFilterShowRules } from 'shared/hooks';
import { Faq as FaqItem } from 'types';
import { useRegisterFaq } from './faq-provider';

export const Faq: FC<{ items: FaqItem[] }> = ({ items }) => {
  useRegisterFaq(useFilterShowRules(items));
  return null;
};
