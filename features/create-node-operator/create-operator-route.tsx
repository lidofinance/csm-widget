import { PATH, CREATE_RULE_BY_TYPE } from 'consts/urls';
import {
  CreatableOperatorType,
  ShowRule,
  useCanCreateNodeOperator,
} from 'shared/hooks';
import { Gate, GateLoaded, Navigate } from 'shared/navigate';
import { CreateOperatorPage } from './create-operator-page';

const CREATE_RULE: Record<CreatableOperatorType, ShowRule> =
  CREATE_RULE_BY_TYPE;

export type CreateOperatorRouteProps = {
  type: CreatableOperatorType;
};

export const CreateOperatorRoute = ({ type }: CreateOperatorRouteProps) => {
  const { isPending } = useCanCreateNodeOperator();

  return (
    <GateLoaded>
      <Gate rule="IS_CONNECTED_WALLET" fallback={<Navigate path={PATH.HOME} />}>
        <Gate rule="IS_CSM_FAMILY" fallback={<Navigate path={PATH.CREATE} />}>
          <GateLoaded additional={isPending}>
            <Gate
              rule={CREATE_RULE[type]}
              fallback={<Navigate path={PATH.CREATE} />}
            >
              <CreateOperatorPage type={type} />
            </Gate>
          </GateLoaded>
        </Gate>
      </Gate>
    </GateLoaded>
  );
};
