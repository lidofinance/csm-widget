import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import {
  AlertButton,
  AlertClose,
  AlertStyled,
  WrappedBackground,
} from './styles';

const AlertWrappedStyled = styled(AlertStyled)`
  min-height: 200px;
  justify-content: end;
  overflow: hidden;

  background: linear-gradient(135deg, #5448ff 0%, #8349ff 100%);
`;

type AlertWrappedProps = {
  onClose?: () => void;
  onLinkClick?: () => void;
};

export const AlertWrapped: FC<AlertWrappedProps> = ({
  onClose,
  onLinkClick,
}) => (
  <AlertWrappedStyled>
    <WrappedBackground />
    <AlertClose onClick={onClose} />
    <LocalLink
      href={PATH.WRAPPED}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.wrappedAlertLink}
      onClick={onLinkClick}
    >
      <AlertButton>See my 2025 wrapped</AlertButton>
    </LocalLink>
  </AlertWrappedStyled>
);
