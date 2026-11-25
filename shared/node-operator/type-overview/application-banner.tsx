import { Banner, Button, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { useShowFlags } from 'shared/hooks';
import { getApplicationDisplayState } from '../type-status/application-display-state';
import { TYPE_PROGRAM, TypeProgram } from '../type-status/consts';
import { formatSentOn } from '../type-status/format-sent-on';
import { TypeCardChip } from '../type-status/type-card-chip';
import type { ApplicationStatus } from '../type-status/types';
import type { TypeApplyState } from '../type-status/use-type-apply-state';
import { getTypeStatusDescription } from '../type-status/type-status-description';

type ApplicationData = { status: ApplicationStatus; createdAt: string };

export type ApplicationBannerState = Pick<
  TypeApplyState<ApplicationData>,
  'typeStatus' | 'hasOperator' | 'data' | 'isTypePending'
>;

type Props = {
  program: TypeProgram;
  state: ApplicationBannerState;
  actionTestId?: string;
};

export const isApplicationBannerVisible = ({
  typeStatus,
  data,
  isTypePending,
}: Pick<ApplicationBannerState, 'typeStatus' | 'data' | 'isTypePending'>) =>
  !isTypePending && (!!data || typeStatus !== 'PENDING');

const renderAction = (
  { program, state, actionTestId }: Props,
  canViewDetails: boolean,
): ReactNode => {
  const { applyPath, claimPath, createPath } = TYPE_PROGRAM[program];
  const { cta = 'viewDetails' } = getApplicationDisplayState({
    formStatus: state.data?.status,
    typeStatus: state.typeStatus,
    hasOperator: state.hasOperator,
  });
  const dataTestId = { root: actionTestId };

  switch (cta) {
    case 'claim':
    case 'create':
      return (
        <Stack as="span" inline direction="row" wrap gap={12}>
          {canViewDetails && (
            <Button variant="outline" href={applyPath}>
              View details
            </Button>
          )}
          <Button
            href={cta === 'claim' ? claimPath : createPath}
            dataTestId={dataTestId}
          >
            {cta === 'claim'
              ? `Claim ${program} type`
              : `Create ${program} operator`}
          </Button>
        </Stack>
      );
    default:
      return canViewDetails ? (
        <Button variant="outline" href={applyPath} dataTestId={dataTestId}>
          View details
        </Button>
      ) : undefined;
  }
};

export const ApplicationBanner: FC<Props> = (props) => {
  const { ICS_APPLY_ENABLED } = useShowFlags();
  const { program, state } = props;
  const { typeStatus, hasOperator, data } = state;
  if (!isApplicationBannerVisible(state)) return null;

  // BannerProps intersects div's `title: string` with ReactNode; the lib renders nodes fine
  const title = (
    <Stack as="span" inline direction="row" wrap align="center" gap={12}>
      Your {program} application
      <TypeCardChip typeStatus={typeStatus} formStatus={data?.status} />
    </Stack>
  );

  return (
    <Banner
      dataTestId={{ root: 'applicationBanner' }}
      title={title as unknown as string}
      description={
        data
          ? formatSentOn(data.createdAt)
          : getTypeStatusDescription(program, typeStatus, hasOperator)
      }
      action={renderAction(props, ICS_APPLY_ENABLED)}
    />
  );
};
