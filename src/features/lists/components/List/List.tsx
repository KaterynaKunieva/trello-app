import React from 'react';
import classes from './list.module.scss';
import IList from '../../types/IList';
import Card from '../../../cards/components/Card/Card';
import Button from '../../../../common/components/UI/Button/Button';
import { DeleteButton } from '../../../../common/components/icons';
import ICard from '../../../cards/types/ICard';
import { UpdateListDto } from '../../types/ListDtos';
import { UpdateCardDto } from '../../../cards/types/CardDtos';
import Editable from '../../../../common/components/UI/Editable/Editable';
import Draggable from '../../../dnd/components/Draggable/Draggable';
import { Coordinates, UseDragReturn } from '../../../dnd/DragNDrop';
import Placeholder from '../../../../common/components/UI/Placeholder/Placeholder';
import { Id } from '../../../../common/interfaces/common';
import useEditForm from '../../../../common/hooks/useEditForm/useEditForm';
import { getPartialObjByPath } from '../../../../common/utils/objects';
import { VALIDATION_RULES } from '../../data/listValidation';

interface Props {
  list: IList;
  onUpdateTitle: (data: UpdateListDto) => Promise<void>;
  onDeleteList: (id: Id) => void;
  isDeleting: boolean;
  isDraggingAllowed: boolean;
  isCardDragAllowed?: boolean;
  registerList: (node: HTMLDivElement | null) => void;
  registerDragging: (node: HTMLDivElement | null) => void;
  onDragCb: (coord: Coordinates) => void;
  isDraggingOver?: boolean;
  cardUseDrag: UseDragReturn<ICard, IList>;
  isCardDeleting: boolean;
  onDeleteCard: (id: Id) => void;
  onUpdateCard: (data: UpdateCardDto) => Promise<void>;
  openCreateCardModal: () => void;
}

function List({
  list,
  onUpdateTitle,
  onDeleteList,
  isDeleting = false,
  isDraggingAllowed = false,
  isCardDragAllowed = true,
  registerList,
  registerDragging,
  onDragCb,
  isDraggingOver = false,
  cardUseDrag,
  isCardDeleting,
  onDeleteCard,
  onUpdateCard,
  openCreateCardModal,
}: Readonly<Props>): React.JSX.Element {
  const isCardDraggingOver = cardUseDrag.isDragging && cardUseDrag.targetContainerId === list.id;

  const renderCard = (card: ICard, i?: number): React.JSX.Element => {
    const isLastItem = i !== undefined && i === list.cards.length - 1;
    const isLastPlaceholder = cardUseDrag.placeholderIndex === list.cards.length;

    const cardJSX = (
      <Card
        key={card.id}
        card={{ ...card, list_id: list.id }}
        onDelete={onDeleteCard}
        onUpdate={onUpdateCard}
        isDeleting={isCardDeleting}
      />
    );

    return (
      <React.Fragment key={card.id}>
        {isCardDraggingOver && cardUseDrag.placeholderIndex === card.position && (
          <Placeholder width={cardUseDrag.draggingItemWidth} height={cardUseDrag.draggingItemHeight} />
        )}

        {isCardDragAllowed ? (
          <Draggable
            ref={(node): void => {
              if (node) {
                cardUseDrag.registerItem(node, card, list.id);
              }
            }}
            className={cardUseDrag.draggingOverIds.has(card.id) ? classes.isDraggingOver : ''}
            transferPayload={{ type: 'CARD', id: card.id, listId: list.id }}
            onDragCb={cardUseDrag.onDragItem}
            registerDragging={(node: HTMLDivElement | null): void => cardUseDrag.registerDraggingItem(node, card)}
          >
            {cardJSX}
          </Draggable>
        ) : (
          <div className={cardUseDrag.draggingOverIds.has(card.id) ? classes.isDraggingOver : ''}>{cardJSX}</div>
        )}

        {isCardDraggingOver && isLastItem && isLastPlaceholder && (
          <Placeholder width={cardUseDrag.draggingItemWidth} height={cardUseDrag.draggingItemHeight} />
        )}
      </React.Fragment>
    );
  };

  const {
    values,
    errors,
    isLoading: isEditing,
    submit,
    onInputChange,
    discardChanges,
  } = useEditForm<UpdateListDto>(
    { id: list.id, title: list.title },
    getPartialObjByPath(VALIDATION_RULES, 'title'),
    onUpdateTitle
  );

  const renderCardsContent = (): React.ReactNode => {
    if (list.cards.length > 0) {
      return list.cards.map(renderCard);
    }
    if (isCardDraggingOver) {
      return <Placeholder width={cardUseDrag.draggingItemWidth} height={cardUseDrag.draggingItemHeight} />;
    }
    return <p className={classes.emptyMessage}>No cards yet</p>;
  };

  const listJSX = (
    <>
      <div className={classes.container}>
        <Editable
          name="title"
          value={values.title}
          onChange={onInputChange}
          handleSubmit={submit}
          error={errors?.title || ''}
          discardChanges={discardChanges}
          className={classes.title}
          isDisabled={isEditing || isDeleting}
        >
          <h2 className={classes.title}>{list.title}</h2>
        </Editable>
        <DeleteButton
          disabled={isDeleting || isEditing}
          onClick={(): void => onDeleteList(list.id)}
          className={classes.deleteBtn}
        />
      </div>

      {renderCardsContent()}
      <Button disabled={isDeleting} className={classes.addButton} onClick={openCreateCardModal}>
        Add a card
      </Button>
    </>
  );

  return (
    <div className={`${classes.column}`}>
      {isDraggingAllowed ? (
        <Draggable
          ref={registerList}
          className={`${classes.list} ${isDraggingOver ? classes.isDraggingOver : ''}`}
          transferPayload={{ type: 'LIST', id: list.id }}
          onDragCb={onDragCb}
          registerDragging={registerDragging}
        >
          {listJSX}
        </Draggable>
      ) : (
        <div className={`${classes.list} ${isDraggingOver ? classes.isDraggingOver : ''}`}>{listJSX}</div>
      )}
    </div>
  );
}

export default List;
