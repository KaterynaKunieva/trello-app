import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import Button from '../../UI/Button/Button';

function IconButton({
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>): React.JSX.Element {
  return (
    <Button variant="ghost" {...props}>
      {children}
    </Button>
  );
}

export default IconButton;
