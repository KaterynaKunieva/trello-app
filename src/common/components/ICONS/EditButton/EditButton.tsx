import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import IconButton from '../IconButton/IconButton';
import editIcon from '../../../../assets/edit.svg';

function EditButton({ ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <IconButton {...props}>
      <img alt="Edit" src={editIcon} />
    </IconButton>
  );
}

export default EditButton;
