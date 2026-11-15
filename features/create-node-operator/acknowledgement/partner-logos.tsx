import { AvatarStack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { trackMatomoEvent } from 'utils';
import {
  LOW_CODE_PARTNERS,
  LowCodePartner,
} from 'features/validate-with-lido/community-staking/low-code-partners';

const LogoImage = styled.img`
  padding: 5px;
  object-fit: contain;
`;

const PartnerLogo: FC<{ partner: LowCodePartner }> = ({
  partner: { name, src, href, matomoEvent },
}) => {
  const image = <LogoImage src={src} alt={name} title={name} />;

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onClick={() => matomoEvent && trackMatomoEvent(matomoEvent)}
    >
      {image}
    </a>
  ) : (
    image
  );
};

const STARTER_PACK_PARTNERS = LOW_CODE_PARTNERS.filter((p) => p.starterPack);

export const PartnerLogos: FC = () => (
  <AvatarStack style={{ marginTop: 8 }}>
    {STARTER_PACK_PARTNERS.map((partner) => (
      <PartnerLogo key={partner.name} partner={partner} />
    ))}
  </AvatarStack>
);
