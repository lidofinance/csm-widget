import { FAQItem } from 'lib/faqList';
import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

export const FaqContext = createContext<FAQItem[]>([]);
FaqContext.displayName = 'FaqContext';

export const useFaqList = () => {
  const value = useContext(FaqContext);
  invariant(value, 'useFaqList was used outside the FaqContext provider');
  return value;
};
