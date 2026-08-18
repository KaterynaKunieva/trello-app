import React, { PropsWithChildren } from 'react';
import classes from './modal.module.scss';
import CloseButton from '../../ICONS/CloseButton/CloseButton';

interface Props {
  isOpen: boolean;
  setIsOpenFalse: () => void;
  className?: string;
  shadow?: boolean;
  position?: 'center' | 'right' | 'left';
}

function Modal({
  isOpen,
  setIsOpenFalse,
  className,
  children,
  shadow = true,
  position = 'center',
}: PropsWithChildren<Props>): React.JSX.Element | null {
  return isOpen ? (
    <>
      <div className={`${classes.modal} ${className || ''} ${classes.noShadow} ${classes[position]}`}>
        <CloseButton onClick={setIsOpenFalse} style={{ margin: '0 0 0 auto' }} />
        {children}
      </div>
      {shadow && <div className={classes.modalBg} />}
    </>
  ) : null;
}

export default Modal;
