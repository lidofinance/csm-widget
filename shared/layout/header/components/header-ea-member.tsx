import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { EaMember } from 'shared/node-operator';

const HeaderEaMember: FC = () => {
  return (
    <NoSSRWrapper>
      <EaMember />
    </NoSSRWrapper>
  );
};

export default HeaderEaMember;
