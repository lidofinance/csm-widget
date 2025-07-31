import { FC } from 'react';
import { plural, PluralProps } from 'utils';

export const Plural: FC<PluralProps> = (props) => {
  return <>{plural(props)}</>;
};
