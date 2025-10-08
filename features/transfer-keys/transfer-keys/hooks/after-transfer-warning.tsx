import { CurveParameters, NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { canAddMorePriorityKeys } from 'utils/curve-parameters';

type Props = {
  operatorInfo: NodeOperatorInfo;
  curveParameters: CurveParameters;
};

export const AfterTransferWarning: FC<Props> = ({
  operatorInfo,
  curveParameters,
}) => {
  const canAddMore = canAddMorePriorityKeys(operatorInfo, curveParameters);

  if (!canAddMore) {
    return null;
  }

  return (
    <WarningBlock>
      <b>Before adding new keys:</b> It is strongly recommended to perform queue
      cleaning first. You can either{' '}
      <LocalLink
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.transferSuccessCleanQueueLink}
        href={PATH.QUEUE_CLEAN}
      >
        clean the queue yourself
      </LocalLink>{' '}
      or wait for someone else to do it. Queue cleaning only needs to be
      performed once.
    </WarningBlock>
  );
};

const WarningBlock = styled.div`
  text-align: left;
  line-height: 24px;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;
