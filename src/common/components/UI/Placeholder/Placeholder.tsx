import React from 'react';
import classes from './placeholder.module.scss';

interface Props {
  height?: number;
  width?: number;
}

function Placeholder({ width, height }: Readonly<Props>): React.JSX.Element {
  return <div className={classes.placeholder} style={{ width: `${width ?? 2}px`, height: `${height ?? 2}px` }} />;
}

export default Placeholder;
