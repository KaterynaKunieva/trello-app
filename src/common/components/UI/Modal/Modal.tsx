import React, { PropsWithChildren, useEffect } from 'react';
import classes from './modal.module.scss';
import { CloseButton } from '../../icons';

interface Props {
  isOpen: boolean;
  close: () => void;
  className?: string;
  shadow?: boolean;
  position?: 'center' | 'right' | 'left';
}

function Modal({
  isOpen,
  close,
  className,
  children,
  shadow = true,
  position = 'center',
}: PropsWithChildren<Props>): React.JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return isOpen ? (
    <>
      <div className={`${classes.modal} ${className || ''} ${classes.noShadow} ${classes[position]}`}>
        <CloseButton onClick={close} className={classes.closeButton} />
        {children}
      </div>
      {shadow && <div className={classes.modalBg} onClick={close} />}
    </>
  ) : null;
}

export default Modal;
