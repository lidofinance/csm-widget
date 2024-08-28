import { FC, memo } from 'react';

import { ChangeRoleFormProvider } from './context';

import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { ChangeRoleFormInfo } from './change-role-form-info';
import { ChangeRoleFormProviderProps } from './context';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';
import { ChangeRoleFormLoader } from './change-role-form-loader';

// TODO: update layout title/subtitle
export const ChangeRoleForm: FC<ChangeRoleFormProviderProps> = memo((props) => {
  return (
    <ChangeRoleFormProvider {...props}>
      <FormBlock>
        <ChangeRoleFormLoader>
          <FormControllerStyled>
            <Info />
            <AddressInput />
            <SubmitButton />
          </FormControllerStyled>
          <ChangeRoleFormInfo />
        </ChangeRoleFormLoader>
      </FormBlock>
    </ChangeRoleFormProvider>
  );
});
