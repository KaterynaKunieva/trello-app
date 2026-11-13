import React, { PropsWithChildren } from 'react';
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
  return isOpen ? (
    <>
      <div className={`${classes.modal} ${className || ''} ${classes.noShadow} ${classes[position]}`}>
        <CloseButton onClick={close} className={classes.closeButton} />
        {children}
      </div>
      {shadow && <div className={classes.modalBg} />}
    </>
  ) : null;
}

export default Modal;
