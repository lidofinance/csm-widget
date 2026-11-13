import { Body, Button, InfoTooltip, Stack } from '@lidofinance/lido-app-ui';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { CurveParameters, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren, useState } from 'react';
import { useParameters } from './parameters';
import { ParametersValue } from './parameters-value';
import {
  ArrowStyle,
  CompareListStyle,
  CompareRowStyle,
  CompareTitleStyle,
  FoldableListStyle,
  ListStyle,
  RowStyle,
} from './styles';

const Title: FC<{ title: string; help?: string }> = ({ title, help }) => (
  <Body weight="bold" dataTestId={{ root: 'parameterTitle' }}>
    {title}
    {help && (
      <>
        {' '}
        <InfoTooltip dataTestId={ICON_TOOLTIP_TEST_ID} content={help} />
      </>
    )}
  </Body>
);

export const ParametersList: FC<{
  parameters?: CurveParameters;
  module?: MODULE_NAME;
}> = ({ parameters, module }) => {
  const PARAMETERS = useParameters(module);
  const [more, setMore] = useState(false);
  const toggleMore = () => setMore((prev) => !prev);

  return (
    <Stack direction="column" gap={24}>
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
      <FoldableListStyle $folded={!more} data-testid="foldableParameters">
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
      <Button
        variant="ghost"
        size="small"
        onClick={toggleMore}
        iconRight={<ArrowStyle $expanded={more} />}
        dataTestId={{ root: 'parametersShowMore' }}
      >
        {more ? 'Show less' : 'Show more'}
      </Button>
    </Stack>
  );
};

export type CompareParametersListItem = {
  parameters?: CurveParameters;
  title?: string;
};

type CompareParametersListProps = {
  items: CompareParametersListItem[];
  module?: MODULE_NAME;
};

export const CompareParametersList: FC<
  PropsWithChildren<CompareParametersListProps>
> = ({ items, module, children }) => {
  const PARAMETERS = useParameters(module);

  return (
    <CompareListStyle $columns={items.length}>
      {children}
      <CompareTitleStyle>
        <p></p>
        {items.map((item, index) => (
          <Body key={index} weight="bold">
            {item.title}
          </Body>
        ))}
      </CompareTitleStyle>
      {PARAMETERS.map(({ title, help, render }) => (
        <CompareRowStyle key={title}>
          <Title title={title} help={help} />
          {items.map((item, index) => (
            <ParametersValue
              key={index}
              loading={!item.parameters}
              values={render(item.parameters)}
            />
          ))}
        </CompareRowStyle>
      ))}
    </CompareListStyle>
  );
};
