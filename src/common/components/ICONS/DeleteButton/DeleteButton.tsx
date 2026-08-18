import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import IconButton from '../IconButton/IconButton';
import deleteIcon from '../../../../assets/delete.svg';

function DeleteButton({ ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <IconButton {...props}>
      <img alt="Delete" src={deleteIcon} />
    </IconButton>
  );
}

export default DeleteButton;
