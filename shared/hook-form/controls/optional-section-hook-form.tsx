import { Box, Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack } from 'shared/components';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

import { ReactComponent as MinusIcon } from 'assets/icons/circle-minus.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/circle-plus.svg';

type FormInput = { [fieldName: string]: boolean };

type FormOptionalProps = {
  titles: [string, string];
  fieldName: string;
};

// TODO: styled checkbox
// TODO: animated collapse
export const OptionalSectionHookForm: FC<
  PropsWithChildren<FormOptionalProps>
> = ({ titles, fieldName, children }) => {
  const { watch, setValue } = useFormContext<FormInput>();

  const showContent = watch(fieldName);

  const onClick = useCallback(() => {
    setValue(fieldName, !showContent);
  }, [fieldName, setValue, showContent]);

  return (
    <Stack gap="md" direction="column">
      <BoxStyle onClick={onClick}>
        <Stack gap="xs" center>
          {showContent ? <MinusIcon /> : <PlusIcon />}
          <Text color="primary" size="xxs">
            {titles[Number(showContent)]}
          </Text>
        </Stack>
      </BoxStyle>
      {showContent && <ContentWrapper>{children}</ContentWrapper>}
    </Stack>
  );
};

const ContentWrapper = styled(StackStyle).attrs({
  $direction: 'column',
})`
  position: relative;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 2px;
    height: 100%;
    left: calc(-${({ theme }) => theme.spaceMap.md}px - 1px);
    background: var(--lido-color-primary);
    opacity: 0.5;
    border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  }
`;

const BoxStyle = styled(Box)`
  cursor: pointer;
`;
