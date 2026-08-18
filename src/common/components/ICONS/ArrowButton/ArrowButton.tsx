import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import IconButton from '../IconButton/IconButton';
import arrowIcon from '../../../../assets/arrow_left.svg';

function ArrowButton({ ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <IconButton {...props}>
      <img alt="Go To" src={arrowIcon} />
    </IconButton>
  );
}

export default ArrowButton;
