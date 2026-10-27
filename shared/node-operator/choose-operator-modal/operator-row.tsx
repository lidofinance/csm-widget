import { OperatorRef } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import { OperatorAvatar } from '../operator-avatar';
import { OperatorRolesTag } from '../operator-roles-tag';
import { OperatorTypeTag } from '../operator-type-tag';
import { useOperatorTitle } from '../use-operator-title';
import {
  AvatarSlotStyle,
  RowNameStyle,
  RowStyle,
  RowSubStyle,
  RowTagsStyle,
  RowTextStyle,
} from './styles';

type OperatorRowProps = {
  operator: ModuleNodeOperator;
  onSelect: (operator: OperatorRef) => void;
};

export const OperatorRow: FC<OperatorRowProps> = ({ operator, onSelect }) => {
  const { name, metadataName } = useOperatorTitle(operator);
  const type = useDisplayOperatorType(operator);

  return (
    <RowStyle
      type="button"
      onClick={() => onSelect(operator)}
      data-testid="selectModalOperatorRow"
    >
      <AvatarSlotStyle>
        <OperatorAvatar operator={operator} size={40} />
      </AvatarSlotStyle>
      <RowTextStyle>
        <RowNameStyle>{name}</RowNameStyle>
        {metadataName && (
          <RowSubStyle data-testid="selectModalOperatorName">
            {metadataName}
          </RowSubStyle>
        )}
      </RowTextStyle>
      <RowTagsStyle>
        {type && <OperatorTypeTag type={type} />}
        <OperatorRolesTag operator={operator} />
      </RowTagsStyle>
    </RowStyle>
  );
};
