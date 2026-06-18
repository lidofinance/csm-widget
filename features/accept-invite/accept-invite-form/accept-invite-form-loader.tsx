import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useAcceptInviteFormData } from './context';

const CenteredText = styled(Text)`
  text-align: center;
`;

export const AcceptInviteFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const data = useAcceptInviteFormData();
  const isEmpty = !data.invites?.length;

  return (
    <FormLoader
      empty={
        isEmpty && (
          <>
            <Text size="sm" weight={700}>
              No pending requests
            </Text>
            <CenteredText size="xs" color="secondary">
              When this wallet is proposed as a new Manager or Rewards address,
              the request will appear here for you to review and accept
            </CenteredText>
          </>
        )
      }
    >
      {children}
    </FormLoader>
  );
};
