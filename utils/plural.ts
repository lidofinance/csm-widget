export type PluralProps = {
  variants: [string, string];
  value?: number;
  showValue?: boolean;
};

const plurals = new Intl.PluralRules('en-US');

export const plural = ({ value, variants, showValue }: PluralProps) => {
  if (value === undefined) return '';
  const res = plurals.select(value) === 'one' ? variants[0] : variants[1];
  return showValue ? `${value} ${res}` : res;
};

export const pluralKeys = (props: Omit<PluralProps, 'variants'>) =>
  plural({ ...props, variants: ['key', 'keys'] });
