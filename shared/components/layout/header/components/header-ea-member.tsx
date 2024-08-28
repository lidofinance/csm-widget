import { FC } from 'react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { EaMember } from 'shared/node-operator/ea-member/ea-member';

const HeaderEaMember: FC = () => {
  return (
    <NoSSRWrapper>
      <EaMember />
    </NoSSRWrapper>
  );
};

export default HeaderEaMember;
