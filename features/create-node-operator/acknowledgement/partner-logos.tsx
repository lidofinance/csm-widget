import { FC } from 'react';
import styled from 'styled-components';
import { trackMatomoEvent } from 'utils';
import {
  LOW_CODE_PARTNERS,
  LowCodePartner,
} from 'features/validate-with-lido/community-staking/low-code-partners';

const LogosStyle = styled.span`
  display: flex;
  margin-top: 8px;
`;

const LogoStyle = styled.span`
  position: relative;
  display: block;
  flex: none;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  background: var(--lido-app-ui-color-background-surface);

  &:not(:last-child) {
    margin-right: -8px;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
    object-fit: contain;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

const LogoLinkStyle = LogoStyle.withComponent('a');

const PartnerLogo: FC<{ partner: LowCodePartner; zIndex: number }> = ({
  partner: { name, src, href, matomoEvent },
  zIndex,
}) => {
  const image = <img src={src} alt={name} />;

  return href ? (
    <LogoLinkStyle
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      style={{ zIndex }}
      onClick={() => matomoEvent && trackMatomoEvent(matomoEvent)}
    >
      {image}
    </LogoLinkStyle>
  ) : (
    <LogoStyle title={name} style={{ zIndex }}>
      {image}
    </LogoStyle>
  );
};

const STARTER_PACK_PARTNERS = LOW_CODE_PARTNERS.filter((p) => p.starterPack);

export const PartnerLogos: FC = () => (
  <LogosStyle>
    {STARTER_PACK_PARTNERS.map((partner, index) => (
      <PartnerLogo
        key={partner.name}
        partner={partner}
        zIndex={STARTER_PACK_PARTNERS.length - index}
      />
    ))}
  </LogosStyle>
);
