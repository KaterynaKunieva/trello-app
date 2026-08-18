import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react';
import classes from './button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <button className={`${classes.button} ${classes[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
