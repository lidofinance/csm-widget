import { FC } from 'react';
import { useHeaderCustomActions } from 'shared/layout/header';
import { TypeButton } from 'shared/node-operator/operator-type';
import { useSubmitKeysFormData } from './context';

/**
 * Operator type button that appears in the header on the create node operator page.
 * Gets the curve ID from the form data and renders the type badge.
 * Uses React Portal to render into the header's custom actions slot.
 */
export const HeaderOperatorTypeButton: FC = () => {
  const { curveId, address } = useSubmitKeysFormData();

  return useHeaderCustomActions(
    address && curveId !== undefined ? (
      <TypeButton curveId={curveId} data-testid="header-operator-type-button" />
    ) : null,
  );
};
