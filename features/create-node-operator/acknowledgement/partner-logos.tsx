import { AvatarStack } from 'shared/components';
import { FC } from 'react';
import s from './partner-logos.module.css';
import { LOW_CODE_PARTNERS } from 'features/validate-with-lido/community-staking/low-code-partners';
import { PartnerAvatar } from 'features/validate-with-lido/community-staking/partner-avatar';

export const PartnerLogos: FC = () => (
  <AvatarStack style={{ marginTop: 8 }}>
    {LOW_CODE_PARTNERS.map((partner) => (
      <PartnerAvatar key={partner.name} {...partner} className={s.logo} />
    ))}
  </AvatarStack>
);
