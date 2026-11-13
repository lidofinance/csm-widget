import { type FC, memo } from 'react';
import { CuratedOperatorDataProvider } from './context/curated-operator-data-provider';
import { CuratedOperatorFormProvider } from './context/curated-operator-form-provider';
import { CuratedOperatorFormPage } from './curated-operator-form-page';

export const CuratedOperatorForm: FC = memo(() => (
  <CuratedOperatorDataProvider>
    <CuratedOperatorFormProvider>
      <CuratedOperatorFormPage />
    </CuratedOperatorFormProvider>
  </CuratedOperatorDataProvider>
));
