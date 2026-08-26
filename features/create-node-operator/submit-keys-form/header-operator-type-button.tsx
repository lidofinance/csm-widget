import { FC } from 'react';
import { useHeaderCustomActions } from 'shared/layout/header';
import { TypeButton } from 'shared/node-operator/operator-type';
import { useSubmitKeysFormData } from './context';
import { useTargetModule } from './context/use-target-module';

/**
 * Operator type button that appears in the header on the create node operator page.
 * Gets the curve ID from the form data and renders the type badge.
 * Uses React Portal to render into the header's custom actions slot.
 */
export const HeaderOperatorTypeButton: FC = () => {
  const { curveId, address } = useSubmitKeysFormData();
  const targetModule = useTargetModule();

  return useHeaderCustomActions(
    address && curveId !== undefined ? (
      <TypeButton
        curveId={curveId}
        module={targetModule}
        data-testid="header-operator-type-button"
      />
    ) : null,
  );
};
