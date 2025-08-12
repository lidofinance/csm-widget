import { Block, Theme } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import { AccordionNavigatable } from 'shared/components/accordion-navigatable';
import styled from 'styled-components';

export const BlockStyle = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const Number = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;

  border-radius: 100%;
  border: 1px solid var(--lido-color-border);

  color: var(--lido-color-text);
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;

  margin-top: -4px;
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  align-items: start;
  position: relative;

  &:not(:last-child) ${Number}:after {
    content: '';
    position: absolute;
    top: 28px;
    bottom: -12px;
    width: 1px;
    background: var(--lido-color-border);
  }
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1 0 40%;
  text-align: left;

  h3 {
    color: var(--lido-color-text);
    font-size: 14px;
    font-weight: 700;
    line-height: 24px;
  }

  p {
    color: var(--lido-color-textSecondary);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
`;

export const ScoreAccordionstyle = styled(AccordionNavigatable)`
  margin: 0;
  & > [type='button'] {
    padding: 0;
    min-height: 24px;
  }
  & > [type='button'] + div > div {
    padding: 4px 0 0;
  }

  p,
  ul,
  ol {
    margin: 0;
  }
`;

export const CategoryItemsWrapper = styled(StackStyle).attrs({
  $direction: 'column',
})<{ $offset?: keyof Theme['spaceMap'] }>`
  position: relative;
  padding-left: ${({ theme, $offset = 'xl' }) => theme.spaceMap[$offset]}px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 2px;
    height: 100%;
    left: 0px;
    background: var(--lido-color-border);
    border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  }
`;
