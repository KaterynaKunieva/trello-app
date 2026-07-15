import React from 'react';
import classes from './board.module.scss';

function Board({ title, style }: { title: string; style: object }): React.JSX.Element {
  return (
    <div className={classes.board} style={style}>
      <h3 className={classes.title}>{title}</h3>
    </div>
  );
}

export default Board;
