import React from 'react';
import classes from './confirmationModal.module.scss';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

interface Props {
  title: string;
  isOpen: boolean;
  close: () => void;
  confirmCallback: () => Promise<void>;
  cancelCallback?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function ConfirmationModal({
  title,
  isOpen,
  close,
  confirmCallback,
  cancelCallback,
  disabled = false,
  isLoading = false,
}: Props): React.JSX.Element {
  const confirm = async (): Promise<void> => {
    try {
      await confirmCallback();
      close();
    } catch {
      // Keep modal open if deletion failed
    }
  };

  const cancel = (): void => {
    if (cancelCallback) {
      cancelCallback();
    }
    close();
  };

  return (
    <Modal isOpen={isOpen} close={cancel}>
      <p className={classes.title}>{title}</p>
      <Button onClick={confirm} disabled={disabled || isLoading}>
        Confirm
      </Button>
    </Modal>
  );
}

export default ConfirmationModal;
