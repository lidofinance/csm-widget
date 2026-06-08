import { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, useState } from 'react';
import { IconTooltip } from '../icon-tooltip/icon-tooltip';
import { Stack } from '../stack/stack';
import { PARAMETERS } from './parameters';
import { ParametersValue } from './parameters-value';
import {
  ArrowStyle,
  CompareListStyle,
  CompareRowStyle,
  CompareTitleStyle,
  FoldableListStyle,
  ListStyle,
  MoreStyle,
  RowStyle,
} from './styles';

export { DefColumnBackground, IcsColumnBackground } from './styles';

const Title: FC<{ title: string; help?: string }> = ({ title, help }) => (
  <Text size="xs" weight={700}>
    {title}
    <IconTooltip tooltip={help} placement="bottomLeft" inline />
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

type CompareParametersListProps = {
  left?: CurveParameters;
  right?: CurveParameters;
  leftTitle?: string;
  rightTitle?: string;
};

export const CompareParametersList: FC<
  PropsWithChildren<CompareParametersListProps>
> = ({ left, right, leftTitle = 'Current', rightTitle = 'New', children }) => {
  return (
    <CompareListStyle>
      {children}
      <CompareTitleStyle>
        <p></p>
        <Text size="xs" weight={700}>
          {leftTitle}
        </Text>
        <Text size="xs" weight={700}>
          {rightTitle}
        </Text>
      </CompareTitleStyle>
      {PARAMETERS.map(({ title, help, render }) => (
        <CompareRowStyle key={title}>
          <Title title={title} help={help} />
          <ParametersValue loading={!left} values={render(left)} />
          <ParametersValue loading={!right} values={render(right)} />
        </CompareRowStyle>
      ))}
    </CompareListStyle>
  );
};
