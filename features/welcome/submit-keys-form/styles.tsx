import styled from 'styled-components';
import { Block, Textarea } from '@lidofinance/lido-ui';
import { FormController } from 'shared/hook-form/form-controller';

export const TextareaStyle = styled(Textarea)`
  z-index: 2;

  textarea {
    word-break: break-all;
    font-family: monospace;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.6em;
  }
  margin-bottom: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const SubmitKeysBlock = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const FormControllerStyled = styled(FormController)`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spaceMap.md}px;
`;
