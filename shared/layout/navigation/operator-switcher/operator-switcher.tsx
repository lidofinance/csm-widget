import {
  IconChevronsUpDown,
  Popover,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useAvailableOperators,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, useCallback, useRef, useState } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import {
  getOperatorName,
  OperatorAvatar,
  OperatorRolesTag,
  OperatorTypeTag,
} from 'shared/node-operator';
import { trackMatomoEvent } from 'utils';
import { SwitchPopup } from './switch-popup';
import s from './styles.module.css';

export const OperatorSwitcher: FC = () => {
  const { nodeOperator, requestSelection, needsSelection } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const type = useDisplayOperatorType(curve ?? nodeOperator);
  const [open, setOpen] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleTipClose = useCallback(() => setTipDismissed(true), []);
  const handleClick = useCallback(() => {
    if (!nodeOperator) {
      requestSelection();
      return;
    }
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickSwitchOperatorButton);
    setOpen((value) => !value);
  }, [nodeOperator, requestSelection]);

  if (!list) return null;

  const showTip =
    !nodeOperator && list.length > 0 && !needsSelection && !tipDismissed;

  return (
    <>
      <button
        className={s.trigger}
        ref={triggerRef}
        type="button"
        data-testid="nodeOperatorHeader"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleClick}
      >
        {nodeOperator ? (
          <>
            <Typography
              variant="body"
              weight="bold"
              as="span"
              className={s.name}
            >
              <OperatorAvatar operator={nodeOperator} size={24} />
              <span>{getOperatorName(nodeOperator)}</span>
            </Typography>
            <Stack
              direction="row"
              align="center"
              gap={4}
              as="span"
              className={s.tags}
            >
              {type && <OperatorTypeTag type={type} />}
              <OperatorRolesTag operator={nodeOperator} />
            </Stack>
          </>
        ) : (
          <Typography variant="body" weight="bold" as="span" className={s.name}>
            <span>Choose a Node Operator</span>
          </Typography>
        )}
        <span className={s.chevron}>
          <IconChevronsUpDown width={20} height={20} />
        </span>
      </button>
      <Popover
        className={s.tip}
        open={showTip}
        onClose={handleTipClose}
        anchorRef={triggerRef}
        placement="top"
        align="start"
        arrow
        modal={false}
        width={240}
        aria-label="Select a Node Operator"
        data-testid="chooseOperatorTip"
      >
        <Typography variant="body" weight="bold">
          Select a Node Operator here
        </Typography>
        <Typography variant="description" color="secondary">
          You can switch between operators anytime
        </Typography>
      </Popover>
      {nodeOperator && open && (
        <SwitchPopup
          onClose={handleClose}
          anchorRef={triggerRef}
          active={nodeOperator}
          list={list}
        />
      )}
    </>
  );
};
