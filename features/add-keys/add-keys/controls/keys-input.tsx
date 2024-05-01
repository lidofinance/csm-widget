import { DepositKeysInputHookForm } from 'shared/hook-form/controls/deposit-keys-input-hook-form';

// const useParseKeys = () => {
//   const { setValue, setError, clearErrors } = useFormContext();

//   const updateKeys = useCallback(
//     (rawKeys: string) => {
//       try {
//         const parsedKeys = JSON.parse(rawKeys);
//         setValue('parsedKeys', parsedKeys);
//         clearErrors('parsedKeys');
//       } catch (e) {
//         setError('rawKeys', { type: 'UNHANDLED', message: 'invalid json' });
//       }
//     },
//     [clearErrors, setError, setValue],
//   );

//   return updateKeys;
// };

export const KeysInput = () => {
  // const {
  //   field,
  //   fieldState: { error },
  // } = useController({ name: 'rawKeys' });
  // const updateKeys = useParseKeys();
  // const hasErrorHighlight = isValidationErrorTypeUnhandled(error?.type);

  return <DepositKeysInputHookForm />;

  // return (
  //   <TextareaStyle
  //     {...field}
  //     label="Copy JSON here"
  //     fullwidth
  //     rows={10}
  //     error={hasErrorHighlight}
  //     onChange={(e) => {
  //       field.onChange(e);
  //       updateKeys(e.target.value);
  //     }}
  //   />
  // );
};
