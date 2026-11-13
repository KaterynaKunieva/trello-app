import React, { PropsWithChildren } from 'react';
import classes from './textError.module.scss';

function TextError({ children }: Readonly<PropsWithChildren>): React.JSX.Element | null {
  if (!children) {
    return null;
  }
  return <p className={classes.error}>{children}</p>;
}

export default TextError;
