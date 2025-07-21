import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreItem as ScoreItemType } from './score-data';
import { AccordionStyle, IconStyle } from './styles';
import { Points } from './points';

type ScoreItemProps = {
  item: ScoreItemType;
  index: number;
};

export const ScoreItem: FC<ScoreItemProps> = ({ item, index }) => {
  return (
    <AccordionStyle
      id={`item-${index}`}
      summary={
        <Stack justify="space-between" align="center">
          <Stack align="center" gap="sm">
            <IconStyle src={item.logo} />
            <Text size="xs">{item.name}</Text>
          </Stack>

          <Text size="xs">
            <Points points={item.points} />
          </Text>
        </Stack>
      }
    >
      <Text size="xs" color="secondary">
        {item.description}
      </Text>
    </AccordionStyle>
  );
};
