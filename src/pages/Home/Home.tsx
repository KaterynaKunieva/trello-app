import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import classes from './home.module.scss';
import api from '../../api/request';
import Board from './components/Board/Board';
import Button from '../../common/components/UI/Button/Button';
import Modal from '../../common/components/UI/Modal/Modal';
import IBoard from '../../common/interfaces/IBoard';
import CreateBoard from './components/CreateBoard/CreateBoard';
import ListWrapper from '../../common/components/UI/Listwrapper/Listwrapper';
import { getCssBackground } from '../../common/utils/base64';

function Home(): React.JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBoards = useCallback(async () => {
    api
      .get('/board')
      .then((data) => setBoards(data?.boards || []))
      .catch(() => {
        setBoards([]);
      });
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const renderBoard = useCallback((board: IBoard) => {
    const style = board.custom;
    let background = style?.background;
    if (background) {
      background = getCssBackground(background.toString());
    }
    return (
      <Link to={`/board/${board.id}`} key={board.id} className={classes.board}>
        <Board title={board.title} style={{ ...style, background }} />
      </Link>
    );
  }, []);

  const createCallback = useCallback(() => {
    fetchBoards();
    setIsModalOpen(false);
  }, [fetchBoards, setIsModalOpen]);

  return (
    <>
      <div className={classes.boards}>
        <ListWrapper list={boards} cb={renderBoard} />
      </div>
      <Button className={classes.button} onClick={(): void => setIsModalOpen(true)}>
        Add a Board
      </Button>
      <Modal isOpen={isModalOpen} setIsOpenFalse={(): void => setIsModalOpen(false)}>
        <CreateBoard onSuccess={createCallback} />
      </Modal>
    </>
  );
}

export default Home;
