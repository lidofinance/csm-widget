import { Divider, H2, Hidden, Stack } from '@lidofinance/lido-app-ui';
import { FC, Fragment } from 'react';
import { TypeColumnsCardStyle } from './operator-type-cards/styles';
import { TypeCard } from './operator-type-cards/type-card';
import { TypesDocsNote } from './operator-type-cards/types-docs-note';
import { useVisibleTypes } from './operator-type-cards/use-visible-types';

export const SelectTypeView: FC = () => {
  const types = useVisibleTypes();

  return (
    <>
      <Stack gap={8}>
        <H2 as="h1">Choose operator type</H2>
        <TypesDocsNote />
      </Stack>
      <TypeColumnsCardStyle>
        <Stack direction={{ base: 'row', mdDown: 'column' }} gap={24}>
          {types.map((type, index) => (
            <Fragment key={type.key}>
              {index > 0 && (
                <>
                  <Hidden as="div" below="md">
                    <Divider orientation="vertical" />
                  </Hidden>
                  <Hidden as="div" above="md">
                    <Divider orientation="horizontal" />
                  </Hidden>
                </>
              )}
              <TypeCard type={type} />
            </Fragment>
          ))}
        </Stack>
      </TypeColumnsCardStyle>
    </>
  );
};
