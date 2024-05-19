import {
  Address,
  Checkbox,
  CheckboxProps,
  ThemeName,
} from '@lidofinance/lido-ui';
import { forwardRef } from 'react';
import { useFormState } from 'react-hook-form';
import styled from 'styled-components';

type KeysItemProps = {
  title: string;
  name: `keys.${number}.checked`;
  index: number;
} & CheckboxProps;

export const KeysItem = forwardRef<HTMLInputElement, KeysItemProps>(
  ({ title, ...props }, ref) => {
    const { isSubmitting } = useFormState();

    const isDisabled = isSubmitting;

    const label = <Address address={title} symbols={50} />;

    return (
      <RequestStyled $disabled={isDisabled}>
        <Checkbox
          {...props}
          data-testid="requestCheckbox"
          label={label}
          ref={ref}
          disabled={isDisabled}
        />
      </RequestStyled>
    );
  },
);

const REQUESTS_LIST_ITEM_SIZE = 57;

const RequestStyled = styled.div<{
  $disabled?: boolean;
  $loading?: boolean;
}>`
  padding: ${({ theme }) => theme.spaceMap.md}px
    ${({ theme }) => theme.spaceMap.lg}px;
  padding-right: 12px;
  border-bottom: 1px solid var(--lido-color-foreground);
  background-color: ${({ theme }) =>
    theme.name === ThemeName.light ? '#F2F5F8' : '#2A2A31'};
  display: flex;
  align-items: center;
  height: ${REQUESTS_LIST_ITEM_SIZE}px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  &:last-child {
    border-bottom-color: var(--lido-color-backgroundSecondary);
  }

  ${({ $loading }) => $loading && `cursor: progress;`}

  a:visited {
    color: var(--lido-color-primary);
  }
`;
