import { FC } from 'react';
import { TextField } from 'shared/hook-form/fields';

export const OperatorInfoStep: FC = () => (
  <>
    <TextField
      name="name"
      label="Name"
      placeholder="Node Operator Name"
      description="This name will be publicly visible on-chain. You can update it later."
      showUntouched
    />
    <TextField
      name="description"
      label="Description"
      placeholder="What should others know about your operator?"
      description="A short blurb about your operator. This description will be publicly visible on-chain and can be updated later."
      showUntouched
    />
  </>
);
