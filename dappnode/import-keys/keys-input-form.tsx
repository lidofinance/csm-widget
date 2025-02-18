import { Address, Link } from '@lidofinance/lido-ui';
import { DropZoneContainer, KeystoreFileRow } from './styles';
import { PasswordInput } from './password-input';
import useKeystoreDrop from './use-keystore-drop';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import { useFormDepositData } from 'shared/hook-form/form-controller';
import { SubmitKeysFormInputType } from 'features/create-node-operator/submit-keys-form/context';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ImportKeysConfirmModal from './import-keys-confirm-modal';

type KeysBrainUploadProps = {
  label?: string;
  fieldName?: string;
  showErrorMessage?: boolean;
  missingKeys: string[];
  error: boolean;
};

export const KeysBrainUpload = ({
  label = 'Drop keystores JSON files here, or click to select files',
  showErrorMessage,
  error: errorProp,
  missingKeys,
}: KeysBrainUploadProps) => {
  const { brainUrl } = useDappnodeUrls();
  const { getRootProps, keysFiles, removeFile, setKeysFiles } =
    useKeystoreDrop(missingKeys);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    if (keysFiles.length === 1) {
      setIsImportModalOpen(true);
    }
  }, [keysFiles]);

  const formObject = useForm<SubmitKeysFormInputType>({
    mode: 'onChange',
  });
  useFormDepositData(formObject);

  return (
    <>
      <h3>Upload keystores</h3>
      <div>
        The following pubkeys are not uploaded in the{' '}
        <Link href={brainUrl}> Staking Brain</Link>:
      </div>
      <div>
        {missingKeys.map((key, i) => (
          <div key={key}>
            <b>{i + 1}.</b> 0x
            <Address address={key} symbols={10} />
          </div>
        ))}
      </div>
      <DropZoneContainer {...getRootProps()} hasError={!!errorProp}>
        <p>{label}</p>
      </DropZoneContainer>
      {showErrorMessage && (
        <div style={{ color: 'red', marginTop: '8px' }}>{}</div>
      )}
      <ImportKeysConfirmModal
        isOpen={isImportModalOpen}
        setIsOpen={setIsImportModalOpen}
        setKeys={setKeysFiles}
      />
      {keysFiles.length > 0 && (
        <>
          <div>
            <h4>Uploaded Files:</h4>
            {keysFiles.map((file, index) => (
              <KeystoreFileRow key={index}>
                <p>{file.name}</p>
                <button onClick={() => removeFile(file.name)}>x</button>
              </KeystoreFileRow>
            ))}
          </div>
          <h4>Password:</h4>
          <PasswordInput />
        </>
      )}
    </>
  );
};
