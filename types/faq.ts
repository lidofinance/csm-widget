import { ReactNode } from 'react';
import { ShowRule } from 'shared/hooks';

export type Faq = {
  title: string;
  anchor: string;
  content: ReactNode;
  showRules?: ShowRule[];
};
