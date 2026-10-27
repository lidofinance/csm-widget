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
  CaptionStyle,
  RowNameStyle,
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
  eligible,
  onCreate,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    trackMatomoEvent(event);
    onCreate();
    void navigate(path);
  };

  return (
    <RowStyle type="button" onClick={handleClick} {...rest}>
      <ModuleMenuIcon variant={variant} />
      <RowTextStyle $gap={4}>
        <RowNameStyle>{title}</RowNameStyle>
        {types.length > 0 && (
          <RowSubStyle>Available types: {types.join(', ')}</RowSubStyle>
        )}
      </RowTextStyle>
      {eligible && <Tag variant="info">You’re eligible</Tag>}
    </RowStyle>
  );
};

const useCreateRows = () => {
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

  return { canCreateCm, cmTypes, csmTypes };
};

type CreateSectionProps = {
  onCreate: () => void;
};

export const CreateSection: FC<CreateSectionProps> = ({ onCreate }) => {
  const { canCreateCm, cmTypes, csmTypes } = useCreateRows();

  if (!canCreateCm && csmTypes.length === 0) return null;

  return (
    <SectionStyle>
      <CaptionStyle>Create a new Node Operator</CaptionStyle>
      {canCreateCm && (
        <CreateRow
          variant="curated2"
          title="New CM Operator"
          types={cmTypes}
          path={PATH.CREATE_CM}
          event={MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCm}
          eligible
          onCreate={onCreate}
          data-testid="selectModalCreateCm"
        />
      )}
      {csmTypes.length > 0 && (
        <CreateRow
          variant="csm2"
          title="New CSM Operator"
          types={csmTypes}
          path={PATH.CREATE}
          event={MATOMO_CLICK_EVENTS_TYPES.chooseOperatorCreateCsm}
          onCreate={onCreate}
          data-testid="selectModalCreateCsm"
        />
      )}
    </SectionStyle>
  );
};
