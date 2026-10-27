import { IconChevronsUpDown } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useAvailableOperators,
  useDappStatus,
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
import { ChevronStyle, NameStyle, TagsStyle, TriggerStyle } from './styles';

export const OperatorSwitcher: FC = () => {
  const { isSupportedChain } = useDappStatus();
  const { nodeOperator, requestSelection } = useNodeOperator();
  const { data: list } = useAvailableOperators();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const type = useDisplayOperatorType(curve ?? nodeOperator);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleClick = useCallback(() => {
    if (!nodeOperator) {
      requestSelection();
      return;
    }
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickSwitchOperatorButton);
    setOpen((value) => !value);
  }, [nodeOperator, requestSelection]);

  if (!isSupportedChain || !list || list.length === 0) return null;

  return (
    <>
      <TriggerStyle
        ref={triggerRef}
        type="button"
        data-testid="nodeOperatorHeader"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleClick}
      >
        {nodeOperator ? (
          <>
            <NameStyle>
              <OperatorAvatar operator={nodeOperator} size={24} />
              <span>{getOperatorName(nodeOperator)}</span>
            </NameStyle>
            <TagsStyle>
              {type && <OperatorTypeTag type={type} />}
              <OperatorRolesTag operator={nodeOperator} />
            </TagsStyle>
          </>
        ) : (
          <NameStyle>
            <span>Choose a Node Operator</span>
          </NameStyle>
        )}
        <ChevronStyle>
          <IconChevronsUpDown width={20} height={20} />
        </ChevronStyle>
      </TriggerStyle>
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
