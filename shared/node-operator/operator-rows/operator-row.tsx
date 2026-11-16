import { OperatorRef } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC } from 'react';
import { useDisplayOperatorType } from 'shared/hooks';
import { OperatorAvatar } from '../operator-avatar';
import { OperatorRolesTag } from '../operator-roles-tag';
import { OperatorTypeTag } from '../operator-type-tag';
import { getOperatorName } from '../operator-name';
import { useOperatorTitle } from '../use-operator-title';
import {
  AvatarSlotStyle,
  RowNameStyle,
  RowSize,
  RowStyle,
  RowSubStyle,
  RowTagsStyle,
  RowTextStyle,
} from './styles';

type OperatorRowProps = {
  operator: ModuleNodeOperator;
  size: RowSize;
  onSelect: (operator: OperatorRef) => void;
  'data-testid': string;
  'data-name-testid': string;
};

type RegularTitleProps = {
  operator: ModuleNodeOperator;
  nameTestId: string;
};

const RegularTitle: FC<RegularTitleProps> = ({ operator, nameTestId }) => {
  const { name, metadataName } = useOperatorTitle(operator);

  return (
    <>
      <RowNameStyle $size="regular">{name}</RowNameStyle>
      {metadataName && (
        <RowSubStyle $size="regular" data-testid={nameTestId}>
          {metadataName}
        </RowSubStyle>
      )}
    </>
  );
};

export const OperatorRow: FC<OperatorRowProps> = ({
  operator,
  size,
  onSelect,
  'data-testid': testId,
  'data-name-testid': nameTestId,
}) => {
  const type = useDisplayOperatorType(operator);
  const compact = size === 'compact';

  return (
    <RowStyle
      $size={size}
      type="button"
      onClick={() => onSelect(operator)}
      data-testid={testId}
    >
      <AvatarSlotStyle $size={size}>
        <OperatorAvatar operator={operator} size={compact ? 24 : 40} />
      </AvatarSlotStyle>
      <RowTextStyle>
        {compact ? (
          <RowNameStyle $size={size} data-testid={nameTestId}>
            {getOperatorName(operator)}
          </RowNameStyle>
        ) : (
          <RegularTitle operator={operator} nameTestId={nameTestId} />
        )}
      </RowTextStyle>
      <RowTagsStyle $size={size}>
        {type && <OperatorTypeTag type={type} tooltip={compact} />}
        <OperatorRolesTag operator={operator} tooltip={compact} />
      </RowTagsStyle>
    </RowStyle>
  );
};
