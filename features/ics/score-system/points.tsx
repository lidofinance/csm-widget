import { FC } from 'react';
import { Plural } from 'shared/components';

export const Points: FC<{ value: number | string }> = ({ value }) => {
  return typeof value === 'number' ? (
    <>
      {value} <Plural variants={['point', 'points']} value={value} />
    </>
  ) : (
    <>{value} points</>
  );
};
