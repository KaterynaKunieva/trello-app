import React, { MouseEvent, useState } from 'react';
import classes from './card.module.scss';
import ICard from '../../types/ICard';
import { DeleteButton } from '../../../../common/components/icons';
import Editable from '../../../../common/components/UI/Editable/Editable';
import { UpdateCardDto } from '../../types/CardDtos';
import { Id } from '../../../../common/interfaces/common';
import useEditForm from '../../../../common/hooks/useEditForm/useEditForm';
import { getPartialObjByPath } from '../../../../common/utils/objects';
import { VALIDATION_RULES } from '../../data/cardValidation';
import { useAppDispatch } from '../../../../app/hooks';
import { openCardModal } from '../../data/currentCardSlice';

interface Props {
  card: ICard;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
  onDelete: (id: Id) => void;
  isDeleting?: boolean;
  disabled?: boolean;
}

function Card({ card, onUpdate, onDelete, isDeleting = false, disabled = false }: Readonly<Props>): React.JSX.Element {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateTitle = (data: UpdateCardDto): Promise<void> =>
    onUpdate({
      ...data,
      id: card.id,
      list_id: card.list_id,
    });

  const {
    values,
    errors,
    isLoading: isEditing,
    submit,
    onInputChange,
    discardChanges,
  } = useEditForm<UpdateCardDto>(
    { id: card.id, list_id: card.list_id, title: card.title },
    getPartialObjByPath(VALIDATION_RULES, 'title'),
    handleUpdateTitle
  );

  const onClickHandler = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    if (isEditable || isDeleting) {
      return;
    }
    dispatch(openCardModal(card));
  };

  const onClickDeleteHandler = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    onDelete(card.id);
  };

  return (
    <div className={`${classes.card} ${disabled ? classes.disabled : ''}`} onClick={onClickHandler}>
      <Editable
        name="title"
        value={values.title}
        onChange={onInputChange}
        handleSubmit={submit}
        error={errors?.title || ''}
        discardChanges={discardChanges}
        className={classes.title}
        isDisabled={isEditing || isDeleting}
        onEditableChange={setIsEditable}
      >
        <h3 className={classes.title}>{card.title}</h3>
      </Editable>
      <DeleteButton disabled={isDeleting || isEditing} onClick={onClickDeleteHandler} className={classes.deleteBtn} />
    </div>
  );
}

export default Card;
