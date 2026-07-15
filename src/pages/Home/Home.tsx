import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './home.module.scss';
import Board from './components/Board/Board';
import Button from '../../common/Button/Button';

function Home(): React.JSX.Element {
  const [boards, setBoards] = useState([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);

  return (
    <>
      <div className={classes.boards}>
        {boards.map((board) => (
          <Link to={`/board/${board.id}`} key={board.id} className={classes.board}>
            <Board title={board.title} style={board.custom} />
          </Link>
        ))}
      </div>
      <Button className={classes.button}>New Board</Button>
    </>
  );
}

export default Home;
