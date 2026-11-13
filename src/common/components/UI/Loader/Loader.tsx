import React from 'react';
import classes from './loader.module.scss';

interface Props {
  text?: string;
  className?: string;
}

function Loader({ text, className = '' }: Readonly<Props>): React.JSX.Element {
  return (
    <div className={`${classes.loaderContainer} ${className}`}>
      <div className={classes.spinner} />
      {text && <p className={classes.text}>{text}</p>}
    </div>
  );
}

export default Loader;
