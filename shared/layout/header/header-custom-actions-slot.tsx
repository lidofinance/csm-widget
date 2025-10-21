import { FC } from 'react';

export const HEADER_PORTAL_ID = 'header-custom-actions';

/**
 * Portal slot for custom header actions.
 * Components can render content into this slot using the useHeaderCustomActions hook.
 */
export const HeaderCustomActionsSlot: FC = () => {
  return <div id={HEADER_PORTAL_ID} />;
};
