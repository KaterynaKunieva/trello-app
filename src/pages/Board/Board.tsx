import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import classes from './board.module.scss';
import Button from '../../common/components/UI/Button/Button';
import Loader from '../../common/components/UI/Loader/Loader';
import { getCssBackground } from '../../common/utils/base64';
import { useBoard } from '../../features/boards/hooks/useBoard';
import useEditForm from '../../common/hooks/useEditForm/useEditForm';
import { DEFAULT_VALUES, VALIDATION_RULES } from '../../features/boards/data/boardValidation';
import { UpdateBoardDto } from '../../features/boards/types/BoardDtos';
import { useBoardModals } from '../../features/boards/hooks/useBoardModals';
import BoardHeader from '../../features/boards/components/BoardHeader/BoardHeader';
import BoardLists from '../../features/boards/components/BoardLists/BoardLists';
import BoardModals from '../../features/boards/components/BoardModals/BoardModals';

function Board(): React.JSX.Element | null {
  const params = useParams<{ board_id: string }>();
  const boardId = params.board_id ?? '';

  const navigate = useNavigate();

  const board = useBoard(boardId);
  const { fetchBoard } = board;
  const boardData = board.board;

  const editForm = useEditForm<UpdateBoardDto>(boardData ?? DEFAULT_VALUES, VALIDATION_RULES, board.updateBoard);
  const modals = useBoardModals(board);

  useEffect(() => {
    if (boardId) {
      fetchBoard();
    } else {
      toast.error('Board ID is missing');
      navigate('/boards', { replace: true });
    }
  }, [boardId, fetchBoard, navigate]);

  const backgroundValue = useMemo(
    (): string => getCssBackground(editForm.values.custom?.background || boardData?.custom.background || ''),
    [editForm.values.custom?.background, boardData?.custom.background]
  );

  if (!boardData) {
    return (
      <div className={classes.board}>
        {board.isLoading && <Loader text="Loading board..." />}
        {board.error && <p className={classes.message}>{board.error}. Please try to reload the page.</p>}
      </div>
    );
  }

  return (
    <div className={classes.board} style={{ background: backgroundValue }}>
      <BoardHeader
        title={boardData.title}
        formTitleValue={editForm.values.title ?? ''}
        backgroundValue={editForm.values?.custom?.background ?? ''}
        titleError={editForm.errors?.title}
        isDisabled={editForm.isLoading || modals.isBoardDeleting}
        onInputChange={editForm.onInputChange}
        onSubmit={editForm.submit}
        onDiscardChanges={editForm.discardChanges}
        onDeleteClick={modals.openDeleteBoardModal}
      />

      <BoardLists
        lists={boardData.lists}
        onUpdateListPosition={board.updateListPosition}
        onUpdateCardPosition={board.updateCardPosition}
        onUpdateList={board.updateList}
        onUpdateCard={board.updateCard}
        onDeleteList={modals.setListIdToDelete}
        onDeleteCard={modals.setCardIdToDelete}
        openCreateCardModal={modals.openCreateCardModal}
        isListDeleting={modals.isListDeleting}
        isCardDeleting={modals.isCardDeleting}
        isBoardDeleting={modals.isBoardDeleting}
      />

      <Button disabled={modals.isBoardDeleting} className={classes.addButton} onClick={modals.openCreateListModal}>
        Add a list
      </Button>

      <BoardModals {...modals.modalProps} />
    </div>
  );
}

export default Board;
