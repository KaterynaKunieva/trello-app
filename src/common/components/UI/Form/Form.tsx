import React, { FormHTMLAttributes, PropsWithChildren, SyntheticEvent } from 'react';
import classes from './form.module.scss';

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e?: SyntheticEvent) => Promise<boolean> | boolean;
}

function Form({ children, className, ...props }: PropsWithChildren<Props>): React.JSX.Element {
  return (
    <form className={`${classes.form} ${className || ''}`} {...props}>
      {children}
    </form>
  );
}

export default Form;
