import { FC } from 'react';
import { Plural } from 'shared/components';

export const Points: FC<{ value: number | string }> = ({ value }) => {
  return typeof value === 'number' ? (
    <Plural variants={['point', 'points']} value={value} showValue={true} />
  ) : (
    <>{value} points</>
  );
};
