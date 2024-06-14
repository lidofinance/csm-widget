import { FC } from 'react';
import { KeysSection } from './keys';
import { RolesSection } from './roles';

export const Dashboard: FC = () => {
  return (
    <>
      <KeysSection />
      {/* <BondSection /> */}
      <RolesSection />
      {/* <Section title="Bond Balance">
        <Block>
          <DataTable>
            {balance &&
              Object.entries(balance).map(([key, value]) => {
                if (key.match(/^[0-9]/)) return null;
                return (
                  <DataTableRow key={key} title={key}>
                    {value?.toString()}
                  </DataTableRow>
                );
              })}
          </DataTable>
        </Block>
      </Section> */}
    </>
  );
};
