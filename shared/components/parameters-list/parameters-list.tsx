import {
  Body,
  Button,
  IconChevronDown,
  InfoTooltip,
  Stack,
} from '@lidofinance/lido-app-ui';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { CurveParameters, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import cn from 'classnames';
import { CSSProperties, FC, PropsWithChildren, useState } from 'react';
import { useParameters } from './parameters';
import { ParametersValue } from './parameters-value';
import s from './styles.module.css';

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
      <div className={s.list}>
        {PARAMETERS.slice(0, 3).map(({ title, help, render }) => (
          <div key={title} className={s.row} data-bordered={more || undefined}>
            <Title title={title} help={help} />
            <ParametersValue
              loading={!parameters}
              values={render(parameters)}
            />
          </div>
        ))}
      </div>
      <div
        className={cn(s.list, s.foldableList)}
        data-folded={!more || undefined}
        data-testid="foldableParameters"
      >
        {PARAMETERS.slice(3).map(({ title, help, render }) => (
          <div key={title} className={s.row}>
            <Title title={title} help={help} />
            <ParametersValue
              loading={!parameters}
              values={render(parameters)}
            />
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="small"
        onClick={toggleMore}
        iconRight={
          <IconChevronDown className={cn(s.arrow, more && s.expanded)} />
        }
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
    <div
      className={s.compareList}
      data-many={items.length > 2 || undefined}
      style={{ '--columns': items.length } as CSSProperties}
    >
      {children}
      <div className={cn(s.row, s.compareRow, s.compareTitle)}>
        <p></p>
        {items.map((item, index) => (
          <Body key={index} weight="bold">
            {item.title}
          </Body>
        ))}
      </div>
      {PARAMETERS.map(({ title, help, render }) => (
        <div key={title} className={cn(s.row, s.compareRow)}>
          <Title title={title} help={help} />
          {items.map((item, index) => (
            <ParametersValue
              key={index}
              loading={!item.parameters}
              values={render(item.parameters)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
