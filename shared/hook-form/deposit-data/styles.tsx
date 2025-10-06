import { ButtonIcon, Close, Textarea } from '@lidofinance/lido-ui';
import { PubkeyContainerStyle } from 'shared/components/address/styles';
import styled from 'styled-components';

export const DropzoneStyle = styled.div``;

export const TextareaStyle = styled(Textarea)`
  & > span {
    border: none;
  }

  textarea {
    word-break: break-all;
    font-family: monospace;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.6em;
    height: 116px;
  }
`;

export const TableContainer = styled.div<{ $equal?: boolean }>`
  background: var(--lido-color-accentControlBg);
  padding: ${({ theme }) => theme.spaceMap.md}px;
  position: relative;
  overflow: scroll;
  height: 150px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  --columns: ${({ $equal }) =>
    $equal ? '1fr 1fr 1fr 1fr' : '3fr 2fr 2fr 2fr'};
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spaceMap.xs}px;
  border-bottom: 1px solid #d1d5db;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  justify-content: space-between;
  align-items: center;
`;

export const HeaderCell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;

  &:first-child {
    justify-content: flex-start;
  }
`;

export const DataCell = styled.div<{ $error?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ $error }) =>
    $error ? 'var(--lido-color-error)' : 'var(--lido-color-text)'};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;

  &:first-child {
    justify-content: flex-start;
  }

  ${PubkeyContainerStyle} {
    font-size: inherit;
  }
`;

export const DeleteButton = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xs',
})`
  color: var(--lido-color-textSecondary);
  flex-shrink: 0;
  padding: 8px;
  margin: -4px;
`;

export const DataError = styled.div`
  grid-column: 1 / -1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputMessageStyle = styled.span<{
  $bordered?: boolean;
  $wrap?: boolean;
}>`
  margin-top: ${({ $bordered }) => ($bordered ? 5 : 6)}px;
  left: ${({ $bordered }) => ($bordered ? -1 : 0)}px;
  position: absolute;
  top: 100%;
  line-height: 1.6em;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  padding: 6px 10px;
  white-space: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  max-width: ${({ $bordered }) => ($bordered ? 'calc(100% + 2px)' : '100%')};
  z-index: 3;

  background: var(--lido-color-error);
  color: var(--lido-color-errorContrast);
  box-shadow: ${({ theme }) => theme.boxShadows.sm}
    var(--lido-color-shadowLight);
`;
