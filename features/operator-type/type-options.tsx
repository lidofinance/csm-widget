import { DvtProviders } from 'features/dvt/shared';
import { IcsProviders } from 'features/ics/shared';
import { FC } from 'react';
import { IcsTypeCard } from './ics-type-card';
import { IdvtcTypeCard } from './idvtc-type-card';
import { OptionsWrap } from './styles';

export const TypeOptions: FC = () => (
  <OptionsWrap>
    <IcsProviders>
      <IcsTypeCard />
    </IcsProviders>
    <DvtProviders>
      <IdvtcTypeCard />
    </DvtProviders>
  </OptionsWrap>
);
