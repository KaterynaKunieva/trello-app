import React, { useCallback, Dispatch, SetStateAction } from 'react';
import classes from './card.module.scss';
import ICard from '../../../../common/interfaces/ICard';
import api from '../../../../api/request';
import DeleteButton from '../../../../common/components/ICONS/DeleteButton/DeleteButton';
import Editable from '../../../../common/components/UI/Editable/Editable';
import { UpdateCardDto } from '../../../../common/interfaces/dtos/CardDtos';
import { VALIDATION_RULES } from '../../../../common/validation/rules/card';
import { getPartialObjByPath } from '../../../../common/utils/objects';
import useEditForm from '../../../../common/hooks/useEditForm/useEditForm';

interface Props extends ICard {
  boardId: string;
  listId: number;
  fetchBoard: () => Promise<void>;
  setCardIdToDelete: Dispatch<SetStateAction<number>>;
  isDeleting?: boolean;
}

function Card({
  id,
  title,
  boardId,
  listId,
  fetchBoard,
  setCardIdToDelete,
  isDeleting = false,
}: Props): React.JSX.Element {
  // edit
  const edit = useCallback(
    async (data: UpdateCardDto): Promise<void> => {
      await api.put(`/board/${boardId}/card/${id}`, {
        ...data,
        list_id: listId,
      });
    },
    [listId, id, boardId]
  );

  const {
    values,
    errors,
    formError,
    isLoading: isEditing,
    submit,
    onInputChange,
    discardChanges,
  } = useEditForm<UpdateCardDto>({ title }, getPartialObjByPath(VALIDATION_RULES, 'title'), fetchBoard, edit);

  return (
    <div className={classes.card}>
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
        <h3 className={classes.title}>{title}</h3>
      </Editable>
      <DeleteButton onClick={(): void => setCardIdToDelete(id)} className={classes.deleteBtn} />
    </div>
  );
}

export default Card;
