import { Tag } from '@lidofinance/lido-app-ui';
import {
  MATOMO_CLICK_EVENTS_TYPES,
  OPERATOR_TYPE_METADATA,
  PATH,
} from 'consts';
import { useCuratedGatesEligibility } from 'modules/web3';
import { FC, useMemo } from 'react';
import { useCreateOptions, useModuleOperatorTypeGetter } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { trackMatomoEvent } from 'utils';
import { ModuleMenuIcon, ModuleMenuIconProps } from '../module-menu-icon';
import {
  AvatarSlotStyle,
  CaptionStyle,
  RowNameStyle,
  RowSize,
  RowStyle,
  RowSubStyle,
  RowTextStyle,
  SectionStyle,
} from './styles';

type CreateRowProps = {
  variant: ModuleMenuIconProps['variant'];
  title: string;
  types: string[];
  path: PATH;
  event: MATOMO_CLICK_EVENTS_TYPES;
  size: RowSize;
  eligible?: boolean;
  onCreate: () => void;
  'data-testid': string;
};

const CreateRow: FC<CreateRowProps> = ({
  variant,
  title,
  types,
  path,
  event,
  size,
  eligible,
  onCreate,
  ...rest
}) => {
  const navigate = useNavigate();
  const compact = size === 'compact';

  const handleClick = () => {
    trackMatomoEvent(event);
    onCreate();
    void navigate(path);
  };

  return (
    <RowStyle $size={size} type="button" onClick={handleClick} {...rest}>
      <AvatarSlotStyle $size={size}>
        <ModuleMenuIcon variant={variant} size={compact ? 40 : 60} />
      </AvatarSlotStyle>
      <RowTextStyle $gap={compact ? 0 : 4}>
        <RowNameStyle $size={size}>{title}</RowNameStyle>
        {types.length > 0 && (
          <RowSubStyle $size={size}>
            Available types: {types.join(', ')}
          </RowSubStyle>
        )}
      </RowTextStyle>
      {eligible && !compact && <Tag variant="info">You’re eligible</Tag>}
    </RowStyle>
  );
};

export const useCreateRows = () => {
  const { data: gates } = useCuratedGatesEligibility();
  const getType = useModuleOperatorTypeGetter();
  const options = useCreateOptions();
  const canCreateCm = options.some((option) => option.kind === 'create-cm');

  const cmTypes = useMemo(
    () => [
      ...new Set(
        (gates ?? []).flatMap(({ curve }) => {
          const type = getType(curve);
          return type ? [OPERATOR_TYPE_METADATA[type].short] : [];
        }),
      ),
    ],
    [gates, getType],
  );

  const csmTypes = useMemo(
    () =>
      options.flatMap((option) =>
        option.kind === 'create'
          ? [OPERATOR_TYPE_METADATA[option.type].short]
          : [],
      ),
    [options],
  );

  return {
    canCreateCm,
    cmTypes,
    csmTypes,
    hasRows: canCreateCm || csmTypes.length > 0,
  };
};

type CreateRows = ReturnType<typeof useCreateRows>;

type CreateSectionProps = {
  size: RowSize;
  rows: CreateRows;
  onCreate: () => void;
  events: {
    cm: MATOMO_CLICK_EVENTS_TYPES;
    csm: MATOMO_CLICK_EVENTS_TYPES;
  };
  testIdPrefix: string;
};

export const CreateSection: FC<CreateSectionProps> = ({
  size,
  rows: { canCreateCm, cmTypes, csmTypes, hasRows },
  onCreate,
  events,
  testIdPrefix,
}) => {
  if (!hasRows) return null;

  return (
    <SectionStyle>
      <CaptionStyle $size={size}>Create a new Node Operator</CaptionStyle>
      {canCreateCm && (
        <CreateRow
          variant="curated2"
          title="New CM Operator"
          types={cmTypes}
          path={PATH.CREATE_CM}
          event={events.cm}
          size={size}
          eligible
          onCreate={onCreate}
          data-testid={`${testIdPrefix}Cm`}
        />
      )}
      {csmTypes.length > 0 && (
        <CreateRow
          variant="csm2"
          title="New CSM Operator"
          types={csmTypes}
          path={PATH.CREATE}
          event={events.csm}
          size={size}
          onCreate={onCreate}
          data-testid={`${testIdPrefix}Csm`}
        />
      )}
    </SectionStyle>
  );
};
