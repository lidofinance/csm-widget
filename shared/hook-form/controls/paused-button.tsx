import React, { FC, ReactNode } from 'react';
import { SubmitButtonHookForm } from './submit-button-hook-form';
import { Note } from 'shared/components';

export type PauseType = 'Module' | 'Accounting';

const titles: Record<PauseType, string> = {
  Module: 'CSM',
  Accounting: 'CSM Accounting',
};

const hints: Record<PauseType, ReactNode> = {
  Module:
    'This means that Node Operator creation and keys upload is not possible',
  Accounting: 'This means that claim and add bond is currently not possible',
};

export const PausedButton: FC<{
  type: PauseType;
}> = ({ type }) => (
  <>
    <SubmitButtonHookForm disabled>
      {titles[type]} is paused
    </SubmitButtonHookForm>
    <Note>{hints[type]}</Note>
  </>
);
