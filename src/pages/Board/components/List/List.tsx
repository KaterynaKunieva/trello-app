import React from 'react';
import classes from './list.module.scss';
import ICard from '../../../../common/interfaces/ICard';
import Card from '../Card/Card';
import Button from '../../../../common/Button/Button';

function List({ title, cards }: { title: string; cards: ICard[] }): React.JSX.Element {
  return (
    <div className={classes.column}>
      <h2 className={classes.title}>{title}</h2>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
      <Button className={classes.addButton}>Add a card</Button>
    </div>
  );
}

export default List;
