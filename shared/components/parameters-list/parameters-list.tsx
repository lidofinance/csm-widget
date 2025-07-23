import { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { IconTooltip } from '../icon-tooltip/icon-tooltip';
import { Stack } from '../stack/stack';
import { PARAMETERS } from './parameters';
import { ParametersValue } from './parameters-value';
import {
  ArrowStyle,
  CompareRowStyle,
  CompareTitleStyle,
  FoldableListStyle,
  ListStyle,
  MoreStyle,
  RowStyle,
} from './styles';

const Title: FC<{ title: string; help?: string }> = ({ title, help }) => (
  <Text size="xs" weight={700}>
    {title}
    <IconTooltip tooltip={help} placement="bottomRight" inline />
  </Text>
);

export const ParametersList: FC<{
  parameters?: CurveParameters;
}> = ({ parameters }) => {
  const [more, setMore] = useState(false);
  const toggleMore = () => setMore((prev) => !prev);

  return (
    <Stack direction="column" gap="xl">
      <ListStyle>
        {PARAMETERS.slice(0, 3).map(({ title, help, render }) => (
          <RowStyle key={title} $bordered={more}>
            <Title title={title} help={help} />
            <ParametersValue
              loading={!parameters}
              values={render(parameters)}
            />
          </RowStyle>
        ))}
      </ListStyle>
      <FoldableListStyle $folded={!more}>
        {PARAMETERS.slice(3).map(({ title, help, render }) => (
          <RowStyle key={title}>
            <Title title={title} help={help} />
            <ParametersValue
              loading={!parameters}
              values={render(parameters)}
            />
          </RowStyle>
        ))}
      </FoldableListStyle>
      <MoreStyle onClick={toggleMore}>
        {more ? 'Show less' : 'Show more'}
        <ArrowStyle $expanded={more} />
      </MoreStyle>
    </Stack>
  );
};

export const CompareParametersList: FC<{
  current?: CurveParameters;
  new?: CurveParameters;
}> = ({ current, new: next }) => {
  return (
    <ListStyle>
      <CompareTitleStyle>
        <p></p>
        <Text size="xs" weight={700}>
          Current
        </Text>
        <Text size="xs" weight={700}>
          New
        </Text>
      </CompareTitleStyle>
      {PARAMETERS.map(({ title, help, render }) => (
        <CompareRowStyle key={title}>
          <Title title={title} help={help} />
          <ParametersValue loading={!current} values={render(current)} />
          <ParametersValue loading={!next} values={render(next)} />
        </CompareRowStyle>
      ))}
    </ListStyle>
  );
};
