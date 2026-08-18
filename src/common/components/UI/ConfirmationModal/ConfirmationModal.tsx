import React, { useCallback } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Error from '../Error/Error';

interface Props {
  title: string;
  isOpen: boolean;
  close: () => void;
  confirmCallback: () => Promise<void>;
  cancelCallback?: () => void;
  error: string;
  disabled?: boolean;
}

function ConfirmationModal({
  title,
  isOpen,
  close,
  confirmCallback,
  cancelCallback,
  error,
  disabled = false,
}: Props): React.JSX.Element {
  const confirm = useCallback(async () => {
    await confirmCallback();
    close();
  }, [close, confirmCallback]);

  const cancel = useCallback(() => {
    if (cancelCallback) {
      cancelCallback();
    }
    close();
  }, [close, cancelCallback]);

  return (
    <Modal isOpen={isOpen} setIsOpenFalse={cancel}>
      <p style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</p>
      <Error>{error}</Error>
      <Button onClick={confirm} disabled={disabled}>
        Confirm
      </Button>
    </Modal>
  );
}

export default ConfirmationModal;
