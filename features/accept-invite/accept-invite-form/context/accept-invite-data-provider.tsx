import {
  KEY_INVITES,
  KEY_OPERATOR_INFO,
  useDappStatus,
  useInvites,
  useNodeOperatorId,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { type AcceptInviteFormNetworkData } from './types';

const useAcceptInviteFormNetworkData: NetworkData<
  AcceptInviteFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { address } = useDappStatus();
  const invitesQuery = useInvites();

  const invites = invitesQuery.data;
  const isInvitesLoading = invitesQuery.isPending;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_INVITES, KEY_OPERATOR_INFO]);
  }, [invalidate]);

  invariant(address);

  return {
    data: {
      nodeOperatorId,
      invites,
      address,
    } as AcceptInviteFormNetworkData,
    isPending: isInvitesLoading,
    revalidate,
  };
};

export const useAcceptInviteFormData = useFormData<AcceptInviteFormNetworkData>;

export const AcceptInviteDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useAcceptInviteFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
