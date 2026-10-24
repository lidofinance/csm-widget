import { Button, ButtonProps } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const HeaderButton = styled((props: ButtonProps) => (
  <Button size="sm" variant="text" color="secondary" {...props} />
))`
  --grouped-padding-offset: 2px;
  --padding: 8px;
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;
  height: 44px;
  padding: 0 var(--padding);

  > span:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  > * {
    :not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: calc(
        var(--padding, 0px) - var(--grouped-padding-offset, 0px)
      );
    }
    :not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding-right: calc(
        var(--padding, 0px) - var(--grouped-padding-offset, 0px)
      );
    }
  }

  &:empty {
    display: none;
  }
`;
