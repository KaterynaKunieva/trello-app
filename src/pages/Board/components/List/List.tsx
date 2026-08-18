import React, { useState, useCallback } from 'react';
import classes from './list.module.scss';
import api from '../../../../api/request';
import IList from '../../../../common/interfaces/IList';
import Card from '../Card/Card';
import Button from '../../../../common/components/UI/Button/Button';
import DeleteButton from '../../../../common/components/ICONS/DeleteButton/DeleteButton';
import ConfirmationModal from '../../../../common/components/UI/ConfirmationModal/ConfirmationModal';
import Modal from '../../../../common/components/UI/Modal/Modal';
import CreateCard from '../CreateCard/CreateCard';
import ICard from '../../../../common/interfaces/ICard';
import ListWrapper from '../../../../common/components/UI/Listwrapper/Listwrapper';
import useEditForm from '../../../../common/hooks/useEditForm/useEditForm';
import { UpdateListDto } from '../../../../common/interfaces/dtos/ListDtos';
import { getPartialObjByPath } from '../../../../common/utils/objects';
import { VALIDATION_RULES } from '../../../../common/validation/rules/list';
import Editable from '../../../../common/components/UI/Editable/Editable';
import useDelete from '../../../../common/hooks/useDelete/useDelete';

interface Props extends IList {
  boardId: string;
  fetchBoard: () => Promise<void>;
  setListIdToDelete: React.Dispatch<React.SetStateAction<number>>;
  isDeleting?: boolean;
}

function List({
  boardId,
  id,
  title,
  cards,
  fetchBoard,
  setListIdToDelete,
  isDeleting = false,
}: Props): React.JSX.Element {
  // creation modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // delete
  const [cardIdToDelete, setCardIdToDelete] = useState<number>(NaN);

  const deleteCard = useCallback(async (): Promise<void> => {
    try {
      await api.delete(`/board/${boardId}/card/${cardIdToDelete}`);
      await fetchBoard();
    } finally {
      setCardIdToDelete(NaN);
    }
  }, [boardId, fetchBoard, cardIdToDelete]);

  const cardDeleting = useDelete(deleteCard);

  const renderCard = useCallback(
    (card: ICard) => (
      <Card
        listId={id}
        boardId={boardId}
        id={card.id}
        key={card.id}
        title={card.title}
        fetchBoard={fetchBoard}
        setCardIdToDelete={setCardIdToDelete}
        isDeleting={cardDeleting.isLoading}
      />
    ),
    [id, boardId, fetchBoard, cardDeleting.isLoading]
  );

  // edit
  const edit = useCallback(
    async (data: UpdateListDto) => {
      await api.put(`/board/${boardId}/list/${id}`, data);
    },
    [boardId, id]
  );

  const {
    values,
    errors,
    formError,
    isLoading: isEditing,
    submit,
    onInputChange,
    discardChanges,
  } = useEditForm<UpdateListDto>({ title }, getPartialObjByPath(VALIDATION_RULES, 'title'), fetchBoard, edit);

  return (
    <div className={classes.column}>
      <Editable
        name="title"
        value={values.title}
        onChange={onInputChange}
        handleSubmit={submit}
        error={errors?.title || formError || ''}
        discardChanges={discardChanges}
        className={classes.title}
        isLoading={isEditing || isDeleting}
      >
        <h2 className={classes.title}>{title}</h2>
      </Editable>
      <DeleteButton onClick={(): void => setListIdToDelete(id)} className={classes.deleteBtn} />
      <ListWrapper list={cards} cb={renderCard} />
      <Button disabled={isDeleting} className={classes.addButton} onClick={(): void => setIsModalOpen(true)}>
        Add a card
      </Button>
      <Modal isOpen={isModalOpen} setIsOpenFalse={(): void => setIsModalOpen(false)}>
        <CreateCard
          boardId={boardId}
          listId={id}
          onSuccess={async (): Promise<void> => {
            setIsModalOpen(false);
            await fetchBoard();
          }}
        />
      </Modal>
      <ConfirmationModal
        title="Are you sure you want to delete this card?"
        isOpen={!Number.isNaN(cardIdToDelete)}
        close={(): void => {
          setCardIdToDelete(NaN);
        }}
        confirmCallback={cardDeleting.submit}
        error={cardDeleting.error}
      />
    </div>
  );
}

export default List;
