import { Checkbox, CheckboxProps, Chip, ThemeName } from '@lidofinance/lido-ui';
import { forwardRef } from 'react';
import { useFormState } from 'react-hook-form';
import { DescriptorId } from 'shared/node-operator';
import styled from 'styled-components';
import { NodeOperatorInvite } from 'types';

type KeysItemProps = {
  invite: NodeOperatorInvite;
  name: `invite.${number}.checked`;
  index: number;
} & CheckboxProps;

export const InviteItem = forwardRef<HTMLInputElement, KeysItemProps>(
  ({ invite, ...props }, ref) => {
    const { isSubmitting } = useFormState();

    const isDisabled = isSubmitting;

    return (
      <RequestStyled>
        <Checkbox {...props} ref={ref} disabled={isDisabled} />
        <WrapperStyled>
          <DescriptorId id={invite.id} />
          <Chip variant="gray">
            {invite.manager ? 'Manager' : 'Reward'} role
          </Chip>
        </WrapperStyled>
      </RequestStyled>
    );
  },
);

const WrapperStyled = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: var(--lido-color-text);
`;

const RequestStyled = styled.label`
  cursor: pointer;
  padding: ${({ theme }) => theme.spaceMap.md}px
    ${({ theme }) => theme.spaceMap.lg}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);
  background-color: ${({ theme }) =>
    theme.name === ThemeName.light ? '#F2F5F8' : '#2A2A31'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  height: 60px;
  width: 100%;

  &:has(:checked) {
    border: 2px solid var(--lido-color-primary);
    padding: calc(${({ theme }) => theme.spaceMap.md}px - 1px)
      calc(${({ theme }) => theme.spaceMap.lg}px - 1px);
  }
`;
