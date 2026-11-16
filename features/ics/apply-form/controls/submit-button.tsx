import { FC } from 'react';
import { SubmitButton as KitSubmitButton } from 'shared/form-page';

export const SubmitButton: FC = () => (
  <KitSubmitButton data-testid="submitBtn">Submit</KitSubmitButton>
);
