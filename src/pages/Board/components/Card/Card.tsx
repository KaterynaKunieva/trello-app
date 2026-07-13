import React from 'react';
import classes from './card.module.scss';

function Card({ title }: { title: string }): React.JSX.Element {
  return (
    <div className={classes.card}>
      <h3 className={classes.title}>{title}</h3>
    </div>
  );
}

export default Card;
