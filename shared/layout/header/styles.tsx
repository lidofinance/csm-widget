import { Button, ButtonProps } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import {
  CRUMBS_UNDER_MEDIA,
  HEADER_HEIGHT,
  HEADER_PHONE_MEDIA,
  SIDEBAR_DRAWER_MEDIA,
} from 'styles/constants';
import { Crumbs } from '../crumbs';

export const HeaderStyle = styled.header`
  position: sticky;
  z-index: 250;
  top: 0;

  display: flex;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
  height: ${HEADER_HEIGHT}px;
  padding: 16px 52px 15px;

  background: var(--lido-color-background);
  border-bottom: 1px solid var(--lido-app-ui-color-border-default);

  ${SIDEBAR_DRAWER_MEDIA} {
    justify-content: space-between;
  }

  ${HEADER_PHONE_MEDIA} {
    padding-inline: 12px;
    gap: 4px;
  }
`;

export const HeaderLeftStyle = styled.div`
  display: none;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  min-width: 0;

  ${SIDEBAR_DRAWER_MEDIA} {
    display: flex;
  }
`;

export const HeaderCrumbsStyle = styled(Crumbs)`
  flex: 1;
  min-width: 0;

  ${SIDEBAR_DRAWER_MEDIA} {
    flex: 0 1 auto;
  }

  ${CRUMBS_UNDER_MEDIA} {
    display: none;
  }
`;

export const HeaderActionsStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;

  ${SIDEBAR_DRAWER_MEDIA} {
    margin-left: 0;
  }
`;

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
