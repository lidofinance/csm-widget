import { Button, Checkbox } from '@lidofinance/lido-ui';
import Modal from 'dappnode/components/modal';
import { useState } from 'react';

interface ImportKeysWarningModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setKeys: (keys: []) => void;
}
export default function ImportKeysWarningModal({
  isOpen,
  setIsOpen,
  setKeys,
}: ImportKeysWarningModalProps) {
  const [checked, setChecked] = useState(false);
  const handleClose = () => {
    setKeys([]);
    setIsOpen(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
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

      <Button
        size="sm"
        variant="text"
        onClick={() => setIsOpen(false)}
        disabled={!checked}
      >
        Confirm
      </Button>
    </Modal>
  );
}
