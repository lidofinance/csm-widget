import { IconPlus } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts';
import {
  OperatorRef,
  useOperatorCurveId,
  useOperatorGroup,
} from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import {
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useCanCreateNodeOperator, useDisplayOperatorType } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import {
  formatGroupLabel,
  getOperatorName,
  isSameOperator,
  OperatorAvatar,
  OperatorRolesTag,
  OperatorTypeTag,
  useOperatorTitle,
  useOperatorTypeModalTrigger,
  useSwitchOperator,
} from 'shared/node-operator';
import {
  BodyStyle,
  CaptionStyle,
  CreateButtonStyle,
  HeaderStyle,
  HeaderTagsStyle,
  HeaderTextStyle,
  NameStyle,
  PopupStyle,
  RowStyle,
  SubLineStyle,
  TagsStyle,
  TitleStyle,
  TypeTagButtonStyle,
} from './styles';

type SwitchPopupProps = {
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  active: ModuleNodeOperator;
  list: ModuleNodeOperator[];
};

type OperatorItemProps = {
  operator: ModuleNodeOperator;
  onSelect: (operator: OperatorRef) => void;
};

const OperatorItem: FC<OperatorItemProps> = ({ operator, onSelect }) => {
  const name = getOperatorName(operator);
  const type = useDisplayOperatorType(operator);

  return (
    <RowStyle
      type="button"
      onClick={() => onSelect(operator)}
      data-testid="switchModalOperatorRow"
    >
      <NameStyle>
        <OperatorAvatar operator={operator} size={24} />
        <span data-testid="switchModalOperatorName">{name}</span>
      </NameStyle>
      <TagsStyle>
        {type && <OperatorTypeTag type={type} tooltip />}
        <OperatorRolesTag operator={operator} tooltip />
      </TagsStyle>
    </RowStyle>
  );
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
    <HeaderStyle>
      <OperatorAvatar operator={operator} size={64} />
      <HeaderTextStyle>
        <TitleStyle data-testid="switchPopupOperatorName">{title}</TitleStyle>
        {(metadataName || groupLabel) && (
          <SubLineStyle>
            {metadataName && <span>{name}</span>}
            {groupLabel && <span>{groupLabel}</span>}
          </SubLineStyle>
        )}
      </HeaderTextStyle>
      <HeaderTagsStyle>
        {type && (
          <TypeTagButtonStyle
            type="button"
            data-testid="switchPopupTypeTag"
            onClick={handleTypeClick}
          >
            <OperatorTypeTag type={type} full />
          </TypeTagButtonStyle>
        )}
        <OperatorRolesTag operator={operator} full />
      </HeaderTagsStyle>
    </HeaderStyle>
  );
};

const POPUP_OFFSET = 16;
const VIEWPORT_MARGIN = 8;

const useMaxHeight = (anchorRef: RefObject<HTMLElement | null>) => {
  const [maxHeight, setMaxHeight] = useState<number>();

  useEffect(() => {
    const update = () => {
      const top = anchorRef.current?.getBoundingClientRect().top;
      if (top !== undefined) {
        setMaxHeight(top - POPUP_OFFSET - VIEWPORT_MARGIN);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [anchorRef]);

  return maxHeight;
};

export const SwitchPopup: FC<SwitchPopupProps> = ({
  onClose,
  anchorRef,
  active,
  list,
}) => {
  const { canCreate } = useCanCreateNodeOperator();
  const switchOperator = useSwitchOperator();
  const navigate = useNavigate();
  const maxHeight = useMaxHeight(anchorRef);
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

  const handleCreate = useCallback(() => {
    onClose();
    void navigate(PATH.CREATE);
  }, [onClose, navigate]);

  return (
    <PopupStyle
      open
      onClose={onClose}
      anchorRef={anchorRef}
      placement="top"
      align="center"
      offset={POPUP_OFFSET}
      width={296 - 16}
      // Popover clamps to an 8px viewport margin; Figma keeps the panel flush with the sidebar
      style={{ maxHeight }}
      aria-label="Switch Node Operator"
      data-testid="switchOperatorPopup"
    >
      <ActiveHeader operator={active} onClose={onClose} />
      {(others.length > 0 || canCreate) && (
        <BodyStyle>
          {others.length > 0 && (
            <>
              <CaptionStyle>Other operators</CaptionStyle>
              {others.map((operator) => (
                <OperatorItem
                  key={`${operator.module}:${operator.nodeOperatorId}`}
                  operator={operator}
                  onSelect={handleSwitch}
                />
              ))}
            </>
          )}
          {canCreate && (
            <CreateButtonStyle
              variant="ghost"
              size="small"
              iconLeft={<IconPlus />}
              onClick={handleCreate}
              data-testid="switchPopupCreateButton"
            >
              Create new operator
            </CreateButtonStyle>
          )}
        </BodyStyle>
      )}
    </PopupStyle>
  );
};
