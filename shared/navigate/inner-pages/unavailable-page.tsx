import { Block, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import styled from 'styled-components';

import WarningIconSrc from 'assets/icons/attention-triangle.svg';

export const WarningIcon = styled.img.attrs({
  src: WarningIconSrc,
  alt: 'warning',
})`
  display: block;
  width: 58px;
  height: 51px;
`;

export const UnavailablePage: FC = () => {
  return (
    <Layout dummy="semi">
      <Block>
        <Stack direction="column" center>
          <WarningIcon />
          <Text size="sm">Sorry, access is currently unavailable.</Text>
        </Stack>
      </Block>
    </Layout>
  );
};
