import React, { PropsWithChildren } from 'react';
import classes from './button.module.scss';

interface Props {
  className?: string;
}

function Button({ children, className = '', ...props }: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <button className={`${classes.button} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
