import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';

export const ApplyButton: FC = () => {
  return (
    <LocalLink href={PATH.TYPE_DVT_APPLY}>
      <Button fullwidth>Apply for IDVTC</Button>
    </LocalLink>
  );
};
