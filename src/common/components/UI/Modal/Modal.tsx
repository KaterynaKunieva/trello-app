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
      if (e.key === 'Escape' && !e.defaultPrevented) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const handleClose = (e: React.MouseEvent): void => {
    e.preventDefault();
    close();
  };

  return isOpen ? (
    <>
      <div className={`${classes.modal} ${className || ''} ${classes.noShadow} ${classes[position]}`}>
        <CloseButton onMouseDown={handleClose} onClick={close} className={classes.closeButton} />
        <div className={classes.scrollableContent}>{children}</div>
      </div>
      {shadow && <div className={classes.modalBg} onMouseDown={handleClose} onClick={close} />}
    </>
  ) : null;
}

export default Modal;
