import { Checkbox, Link } from '@lidofinance/lido-ui';
import Modal, { LinkWrapper } from 'dappnode/components/modal';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import { useState } from 'react';

interface ImportKeysWarningModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export default function ImportKeysWarningModal({
  isOpen,
  setIsOpen,
}: ImportKeysWarningModalProps) {
  const { brainUrl } = useDappnodeUrls();
  const [checked, setChecked] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3>Key Import Advisory</h3>
      <p>
        It is crucial that the keys you are about to use are not active or
        running on any other machine. Running the same keys in multiple
        locations can lead to conflicts, loss of funds, or security
        vulnerabilities.
      </p>
      <p>Please confirm your understanding by checking the box below:</p>
      <Checkbox
        onChange={(e) => setChecked(e.target.checked)}
        label="I understand it and promise I don't have these keys running somewhere else"
        checked={checked}
      />

      {checked && (
        <LinkWrapper>
          <button onClick={handleClose}>
            <Link href={brainUrl}>Import keys</Link>
          </button>
        </LinkWrapper>
      )}
    </Modal>
  );
}
