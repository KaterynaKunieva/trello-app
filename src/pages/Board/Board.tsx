import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import IList from '../../common/interfaces/IList';
import { BoardDto, UpdateBoardDto } from '../../common/interfaces/dtos/BoardDtos';
import classes from './board.module.scss';
import api from '../../api/request';
import List from './components/List/List';
import Button from '../../common/components/UI/Button/Button';
import InputBackground from '../../common/components/UI/InputBackground/InputBackground';
import DeleteButton from '../../common/components/ICONS/DeleteButton/DeleteButton';
import Editable from '../../common/components/UI/Editable/Editable';
import Modal from '../../common/components/UI/Modal/Modal';
import CreateList from './components/CreateList/CreateList';
import ListWrapper from '../../common/components/UI/Listwrapper/Listwrapper';
import ConfirmationModal from '../../common/components/UI/ConfirmationModal/ConfirmationModal';
import { VALIDATION_RULES, DEFAULT_VALUES } from '../../common/validation/rules/board';
import { extractErrorMessage } from '../../api/utils';
import useEditForm from '../../common/hooks/useEditForm/useEditForm';
import useDelete from '../../common/hooks/useDelete/useDelete';
import { getCssBackground } from '../../common/utils/base64';

function Board(): React.JSX.Element {
  const params = useParams();
  const navigate = useNavigate();

  // view
  const [boardView, setBoardView] = useState<BoardDto>(DEFAULT_VALUES);

  // create modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBoard = useCallback(async (): Promise<void> => {
    try {
      const data = await api.get(`/board/${params.board_id}`);
      setBoardView(data);
    } catch (err: unknown) {
      toast.error(`Error fetching board: ${extractErrorMessage(err)}`);
    }
  }, [params.board_id]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // edit
  const edit = useCallback(
    async (data: UpdateBoardDto) => {
      await api.put(`/board/${params.board_id}`, data);
    },
    [params.board_id]
  );

  const {
    values,
    errors,
    formError,
    isLoading: isEditing,
    submit,
    onInputChange,
    discardChanges,
  } = useEditForm<UpdateBoardDto>(boardView, VALIDATION_RULES, fetchBoard, edit);

  // delete
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  const [listIdToDelete, setListIdToDelete] = useState<number>(NaN);

  const deleteBoard = useCallback(async (): Promise<void> => {
    await api.delete(`/board/${params.board_id}`);
    navigate('/', { replace: true });
  }, [params.board_id, navigate]);

  const boardDeleting = useDelete(deleteBoard);

  const deleteList = useCallback(async (): Promise<void> => {
    await api.delete(`/board/${params.board_id}/list/${listIdToDelete}`);
    await fetchBoard();
  }, [params.board_id, listIdToDelete, fetchBoard]);

  const listDeleting = useDelete(deleteList);

  const renderList = useCallback(
    (list: IList) => (
      <List
        key={list.id}
        boardId={params.board_id || ''}
        id={list.id}
        title={list.title}
        cards={list.cards}
        fetchBoard={fetchBoard}
        setListIdToDelete={setListIdToDelete}
        isDeleting={listDeleting.isLoading || boardDeleting.isLoading}
      />
    ),
    [params.board_id, fetchBoard, listDeleting.isLoading, boardDeleting.isLoading]
  );

  const backgroundValue = useMemo(
    (): string => getCssBackground(values.custom.background || boardView.custom.background),
    [values.custom.background, boardView.custom.background]
  );

  return (
    <div className={classes.board} style={{ background: backgroundValue }}>
      <Editable
        name="title"
        value={values.title}
        onChange={onInputChange}
        handleSubmit={submit}
        error={errors?.title || formError || ''}
        discardChanges={discardChanges}
        className={classes.title}
        isLoading={isEditing || boardDeleting.isLoading}
      >
        <h1 className={classes.title}>{boardView.title}</h1>
      </Editable>
      <div className={classes.icons}>
        <DeleteButton onClick={(): void => setIsDeleteBoardModalOpen(true)} className={classes.deleteBtn} />
        <InputBackground
          error={formError}
          submit={submit}
          name="custom.background"
          value={values?.custom?.background}
          onChange={onInputChange}
          discardChanges={discardChanges}
        />
      </div>
      <div className={classes.lists}>
        <ListWrapper list={boardView.lists} cb={renderList} />
      </div>
      <Button
        disabled={boardDeleting.isLoading}
        className={classes.addButton}
        onClick={(): void => setIsModalOpen(true)}
      >
        Add a list
      </Button>
      <Modal isOpen={isModalOpen} setIsOpenFalse={(): void => setIsModalOpen(false)}>
        <CreateList
          boardId={params.board_id || ''}
          onSuccess={async (): Promise<void> => {
            setIsModalOpen(false);
            await fetchBoard();
          }}
        />
      </Modal>
      <ConfirmationModal
        title="Are you sure you want to delete this board?"
        isOpen={isDeleteBoardModalOpen}
        close={(): void => setIsDeleteBoardModalOpen(false)}
        confirmCallback={boardDeleting.submit}
        error={boardDeleting.error}
      />
      <ConfirmationModal
        title="Are you sure you want to delete this list?"
        isOpen={!Number.isNaN(listIdToDelete)}
        close={(): void => setListIdToDelete(NaN)}
        confirmCallback={listDeleting.submit}
        error={listDeleting.error}
      />
    </div>
  );
}

export default Board;
