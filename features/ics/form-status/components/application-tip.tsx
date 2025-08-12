import { Text } from '@lidofinance/lido-ui';
import { IcsResponseDto } from 'features/ics/shared';
import { FC } from 'react';
import { BlockStyled } from '../styles';
import { Stack } from 'shared/components';

type Props = Pick<IcsResponseDto, 'comments'>;

export const ApplicationTip: FC<Props> = ({ comments }) => {
  const show = !!comments.additionalAddresses?.length;

  if (!show) return null;
  return (
    <BlockStyled>
      <Stack direction="column">
        <Text size="xs" weight="bold">
          What you can do
        </Text>
        <Text size="xs">
          If you believe that these address(es) were incorrectly flagged, you
          may submit an appeal on the Lido Research Forum for review by the CSM
          Committee.
        </Text>
      </Stack>
    </BlockStyled>
  );
};
