import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './home.module.scss';
import Board from '../../features/boards/components/Board/Board';
import Button from '../../common/components/UI/Button/Button';
import Modal from '../../common/components/UI/Modal/Modal';
import CreateBoard from '../../features/boards/components/CreateBoard/CreateBoard';
import Loader from '../../common/components/UI/Loader/Loader';
import { getCssBackground } from '../../common/utils/base64';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBoards } from '../../features/boards/data/boardsSlice';

function Home(): React.JSX.Element {
  const { boards, error } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  if (!boards) {
    return (
      <div className={classes.boards}>
        {error ? (
          <p className={classes.message}>{error}. Please try to reload the page.</p>
        ) : (
          <Loader text="Loading boards..." />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={classes.boards}>
        {boards.length > 0 ? (
          boards.map((board) => {
            const background = board.custom?.background
              ? getCssBackground(board.custom.background.toString())
              : undefined;

            return (
              <Link to={`/board/${board.id}`} key={board.id} className={classes.board}>
                <Board title={board.title} style={{ ...board.custom, background }} />
              </Link>
            );
          })
        ) : (
          <p className={classes.emptyMessage}>No boards yet</p>
        )}
      </div>
      <Button className={classes.button} onClick={(): void => setIsModalOpen(true)}>
        Add a Board
      </Button>
      <Modal isOpen={isModalOpen} close={(): void => setIsModalOpen(false)}>
        <CreateBoard onSuccess={(): void => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}

export default Home;
