import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import IconButton from './IconButton';
import deleteIcon from '../../../assets/delete.svg';

function DeleteButton({ ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <IconButton {...props}>
      <img width={23} height={23} alt="Delete" src={deleteIcon} />
    </IconButton>
  );
}

export default DeleteButton;
