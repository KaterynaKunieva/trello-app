import React, { PropsWithChildren } from 'react';
import classes from './error.module.scss';

function Error({ children }: PropsWithChildren): React.JSX.Element {
  return <p className={classes.error}>{children}</p>;
}

export default Error;
