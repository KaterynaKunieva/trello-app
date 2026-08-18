import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import IconButton from '../IconButton/IconButton';
import closeIcon from '../../../../assets/close.svg';

function CloseButton({ ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <IconButton {...props}>
      <img alt="Close" src={closeIcon} />
    </IconButton>
  );
}

export default CloseButton;
