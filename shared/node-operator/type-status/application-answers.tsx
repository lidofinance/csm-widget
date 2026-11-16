import { Copy, Modal, SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { StretchStack } from 'shared/components';
import { TrailingInput } from 'shared/hook-form/fields/trailing-input';
import styled from 'styled-components';

export const WideModalStyle = styled(Modal)`
  width: 680px;
  max-width: 100%;
`;

type AnswerSectionProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
  dataTestId?: string;
}>;

export const AnswerSection: FC<AnswerSectionProps> = ({
  title,
  action,
  dataTestId,
  children,
}) => (
  <StretchStack gap={12} data-testid={dataTestId}>
    <SectionTitle title={title} action={action} />
    {children}
  </StretchStack>
);

type AnswerFieldProps = {
  name: string;
  value: string;
  label?: string;
  error?: string | null;
};

export const AnswerField: FC<AnswerFieldProps> = ({
  name,
  value,
  label,
  error,
}) => (
  <TrailingInput
    disabled
    name={name}
    label={label}
    value={value}
    error={error || false}
    trailing={<Copy text={value} />}
  />
);
