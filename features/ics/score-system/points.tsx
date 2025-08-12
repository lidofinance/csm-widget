import { FC } from 'react';
import { Plural } from 'shared/components';

export const Points: FC<{ points: number | string }> = ({ points }) => {
  return typeof points === 'number' ? (
    <Plural variants={['point', 'points']} value={points} showValue={true} />
  ) : (
    <>{points} points</>
  );
};
