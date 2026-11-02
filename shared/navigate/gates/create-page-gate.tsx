import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { ShowRule, useCanCreateNodeOperator } from 'shared/hooks';
import { Navigate } from '../navigate';
import { Gate } from './gate';
import { GateLoaded } from './gate-loaded';

type CreatePageGateProps = { rule: ShowRule };

// CAN_CREATE_* flips false right after creation (appendNO, consumed proof or gate);
// the latch keeps the success screen mounted for the creating wallet
export const CreatePageGate: FC<PropsWithChildren<CreatePageGateProps>> = ({
  rule,
  children,
}) => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <GateLoaded additional={isPending}>
          <Gate rule={rule} fallback={<Navigate path={PATH.CREATE} />} latch>
            {children}
          </Gate>
        </GateLoaded>
      </Gate>
    </GateLoaded>
  );
};
