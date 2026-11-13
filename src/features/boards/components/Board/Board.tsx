import React, { CSSProperties } from 'react';
import classes from './board.module.scss';

interface Props {
  title: string;
  style?: CSSProperties;
}

function Board({ title, style }: Readonly<Props>): React.JSX.Element {
  return (
    <div className={classes.board} style={style}>
      <h3 className={classes.title}>{title}</h3>
    </div>
  );
}

export default Board;
