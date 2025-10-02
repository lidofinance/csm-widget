import { ReactNode } from 'react';
import { ShowRule } from 'shared/hooks';

export type Faq = {
  title: ReactNode;
  anchor: string;
  content: ReactNode;
  showRules?: ShowRule[];
};
