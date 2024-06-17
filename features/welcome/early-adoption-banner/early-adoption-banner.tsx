import { FC } from 'react';

import { ButtonIcon, External } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';
import { BlockStyled, Header, Heading } from './styles';

export const EarlyAdoptionBanner: FC = () => {
  return (
    <BlockStyled>
      <Heading>
        <Header>Early Adoption mode is active</Header>
        <p>
          During this period, only curated community stakers are eligible to
          join CSM. After the end of the period, CSM entry will be fully
          permissionless.
        </p>
      </Heading>
      <Stack>
        <ButtonIcon
          as="a"
          icon={<External />}
          size="sm"
          variant="text"
          color="secondary"
          fullwidth
        >
          Learn more about Early Adoption
        </ButtonIcon>
        <ButtonIcon
          as="a"
          icon={<External />}
          size="sm"
          variant="translucent"
          color="secondary"
          fullwidth
        >
          See curated list
        </ButtonIcon>
      </Stack>
    </BlockStyled>
  );
};
