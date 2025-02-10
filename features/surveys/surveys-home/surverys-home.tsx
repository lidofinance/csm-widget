import { Block, Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';

export const SurveysHome: FC = () => {
  return (
    <Block>
      <Stack align="center" spaceBetween>
        <Text as="h3" size="sm" weight="bold">
          Contact information
        </Text>
        <LocalLink href="/surveys/contact-information">
          <Button variant="outlined" size="sm">
            Fill in
          </Button>
        </LocalLink>
      </Stack>
    </Block>
  );
};
