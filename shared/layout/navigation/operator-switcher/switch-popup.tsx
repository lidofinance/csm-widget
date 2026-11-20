import { Divider, Popover, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import {
  OperatorRef,
  useOperatorCurveId,
  useOperatorGroup,
} from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC, RefObject, useCallback, useMemo } from 'react';
import {
  formatGroupLabel,
  isSameOperator,
  OperatorAvatar,
  CaptionStyle,
  CreateSection,
  OperatorRolesTag,
  OperatorRow,
  OperatorTypeTag,
  useCreateRows,
  useOperatorTitle,
  useOperatorTypeModalTrigger,
  useSwitchOperator,
} from 'shared/node-operator';
import s from './styles.module.css';

const CREATE_EVENTS = {
  cm: MATOMO_CLICK_EVENTS_TYPES.switchOperatorCreateCm,
  csm: MATOMO_CLICK_EVENTS_TYPES.switchOperatorCreateCsm,
};

type SwitchPopupProps = {
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  active: ModuleNodeOperator;
  list: ModuleNodeOperator[];
};

type ActiveHeaderProps = {
  operator: ModuleNodeOperator;
  onClose: () => void;
};

const ActiveHeader: FC<ActiveHeaderProps> = ({ operator, onClose }) => {
  const { name, title, metadataName } = useOperatorTitle(operator);
  const { data: group } = useOperatorGroup(operator);
  const groupLabel = group ? formatGroupLabel(group) : undefined;
  const { data: curve } = useOperatorCurveId(operator);
  const { type, handleClick } = useOperatorTypeModalTrigger(curve);

  const handleTypeClick = useCallback(() => {
    onClose();
    handleClick();
  }, [onClose, handleClick]);

  return (
    <Stack align="center" gap={12} className={s.header}>
      <OperatorAvatar operator={operator} size={64} />
      <Stack align="center" gap={0} className={s.headerText}>
        <Typography
          variant="h3"
          weight="semibold"
          as="span"
          className={s.title}
          data-testid="switchPopupOperatorName"
        >
          {title}
        </Typography>
        {(metadataName || groupLabel) && (
          <Typography
            variant="body"
            color="tertiary"
            as="span"
            className={s.subLine}
          >
            {metadataName && <span>{name}</span>}
            {groupLabel && <span>{groupLabel}</span>}
          </Typography>
        )}
      </Stack>
      <Stack align="center" gap={8} className={s.headerTags}>
        {type && (
          <OperatorTypeTag
            type={type}
            full
            data-testid="switchPopupTypeTag"
            onClick={handleTypeClick}
          />
        )}
        <OperatorRolesTag operator={operator} full />
      </Stack>
    </Stack>
  );
};

const POPUP_OFFSET = 8;

export const SwitchPopup: FC<SwitchPopupProps> = ({
  onClose,
  anchorRef,
  active,
  list,
}) => {
  const createRows = useCreateRows();
  const switchOperator = useSwitchOperator();
  const others = useMemo(
    () => list.filter((item) => !isSameOperator(item, active)),
    [list, active],
  );

  const handleSwitch = useCallback(
    (operator: OperatorRef) => {
      switchOperator(operator);
      onClose();
    },
    [switchOperator, onClose],
  );

  return (
    <Popover
      className={s.popup}
      open
      onClose={onClose}
      anchorRef={anchorRef}
      placement="top"
      align="center"
      arrow
      offset={POPUP_OFFSET}
      width={296 - 16}
      aria-label="Switch Node Operator"
      data-testid="switchOperatorPopup"
    >
      <ActiveHeader operator={active} onClose={onClose} />
      {(others.length > 0 || createRows.hasRows) && (
        <Stack gap={0} className={s.body}>
          <Divider />
          <Stack gap={20} className={s.bodyContent}>
            {others.length > 0 && (
              <div>
                <CaptionStyle $size="compact">Other operators</CaptionStyle>
                {others.map((operator) => (
                  <OperatorRow
                    key={`${operator.module}:${operator.nodeOperatorId}`}
                    operator={operator}
                    size="compact"
                    onSelect={handleSwitch}
                    data-testid="switchModalOperatorRow"
                    data-name-testid="switchModalOperatorName"
                  />
                ))}
              </div>
            )}
            <CreateSection
              size="compact"
              rows={createRows}
              onCreate={onClose}
              events={CREATE_EVENTS}
              testIdPrefix="switchPopupCreate"
            />
          </Stack>
        </Stack>
      )}
    </Popover>
  );
};
