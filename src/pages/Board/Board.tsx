import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './board.module.scss';
import List from './components/List/List';
import Button from '../../common/Button/Button';

function Board(): React.JSX.Element {
  const [title, setTitle] = useState('Моя тестова дошка');
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);
  const params = useParams();

  return (
    <div className={classes.board}>
      <h1 className={classes.title}>
        {params.board_id} {title}
      </h1>
      <div className={classes.lists}>
        {lists.map((list) => (
          <List key={list.id} title={list.title} cards={list.cards} />
        ))}
      </div>
      <Button className={classes.addButton}>Add a list</Button>
    </div>
  );
}

export default Board;
