import { FC } from 'react';

export const Plural: FC<{ variants: [string, string]; value: number }> = ({
  variants,
  value,
}) => {
  const plurals = new Intl.PluralRules('en-US');
  return plurals.select(value) === 'one' ? variants[0] : variants[1];
};
