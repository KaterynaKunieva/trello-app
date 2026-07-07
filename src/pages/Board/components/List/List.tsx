import React from 'react';
import './list.scss';
import ICard from '../../../../common/interfaces/ICard';
import Card from '../Card/Card';

function List({ title, cards }: { title: string; cards: ICard[] }): React.JSX.Element {
  return (
    <>
      <h1>{title}</h1>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
      <button>Add new card</button>
    </>
  );
}

export default List;
