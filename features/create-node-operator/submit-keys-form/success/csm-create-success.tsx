import { StatItem } from '@lidofinance/lido-app-ui';
import type { CreateSuccess } from 'features/create-node-operator/create-success/create-success';
import { FC } from 'react';
import { SuccessScreen } from 'shared/form-page';
import { OperatorAvatar, TypeBadge } from 'shared/node-operator';
import styled from 'styled-components';
import { CsmCreateActions } from './csm-create-actions';
import { getCsmCreateStats } from './csm-create-stats';
import { CustomAddressesNotice } from './custom-addresses-notice';
import { WhatsNext } from './whats-next';

const TypeBadgeBox = styled.span`
  display: flex;
  flex: none;
  width: 24px;
  height: 24px;

  && img {
    width: 100%;
    height: 100%;
  }
`;

export const CsmCreateSuccess: FC<{ created: CreateSuccess }> = ({
  created,
}) => {
  const stats = getCsmCreateStats(created);

  return (
    <SuccessScreen
      title="Congratulations!"
      description="Your Node Operator is set up and ready. You can now monitor your keys, track activity, and start earning rewards."
      notice={
        created.hasRole ? undefined : (
          <CustomAddressesNotice operator={created.operator} />
        )
      }
      stats={
        <>
          <StatItem
            label="Node Operator ID"
            value={stats.operatorName}
            icon={<OperatorAvatar operator={created.operator} size={24} />}
            dataTestId={{ value: 'createdOperatorId' }}
          />
          <StatItem
            label="Node Operator type"
            value={stats.typeShort}
            icon={
              <TypeBadgeBox>
                <TypeBadge type={created.type} />
              </TypeBadgeBox>
            }
            dataTestId={{ value: 'createdOperatorType' }}
          />
          {stats.keysCount !== undefined && (
            <StatItem label="Keys uploaded" value={stats.keysCount} />
          )}
          {stats.bond && <StatItem label="Bond deposited" value={stats.bond} />}
        </>
      }
      next={<WhatsNext created={created} />}
      actions={<CsmCreateActions created={created} />}
    />
  );
};
