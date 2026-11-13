import React, { useMemo } from 'react';
import IList from '../../../lists/types/IList';
import ICard from '../../../cards/types/ICard';
import { Id } from '../../../../common/interfaces/common';
import { UpdateListDto } from '../../../lists/types/ListDtos';
import { NewCardTargetInfo, UpdateCardDto } from '../../../cards/types/CardDtos';
import useDrag from '../../../dnd/useDrag';
import { DRAG_EL_TYPE, DRAG_ORIENTATION } from '../../../dnd/DragNDrop';
import Placeholder from '../../../../common/components/UI/Placeholder/Placeholder';
import List from '../../../lists/components/List/List';
import DndDebugOverlay, { DndConfig } from '../../../dnd/components/DndDebugOverlay/DndDebugOverlay';
import { IS_DEBUG } from '../../../../config/env';
import classes from './boardLists.module.scss';

interface Props {
  lists: IList[];
  onUpdateListPosition: (list: IList, position: number) => Promise<void>;
  onUpdateCardPosition: (card: ICard, position: number, listId: Id | null) => Promise<void>;
  onUpdateList: (id: Id, data: UpdateListDto) => Promise<void>;
  onUpdateCard: (data: UpdateCardDto) => Promise<void>;
  onDeleteList: (id: Id) => void;
  onDeleteCard: (id: Id) => void;
  openCreateCardModal: (info: NewCardTargetInfo) => void;
  isListDeleting: boolean;
  isCardDeleting: boolean;
  isBoardDeleting: boolean;
}

function BoardLists({
  lists,
  onUpdateListPosition,
  onUpdateCardPosition,
  onUpdateList,
  onUpdateCard,
  onDeleteList,
  onDeleteCard,
  openCreateCardModal,
  isListDeleting,
  isCardDeleting,
  isBoardDeleting,
}: Readonly<Props>): React.JSX.Element {
  const listDrag = useDrag<IList>(onUpdateListPosition, DRAG_ORIENTATION.HORIZONTAL);
  const cardDrag = useDrag<ICard, IList>(onUpdateCardPosition, DRAG_ORIENTATION.VERTICAL);

  const renderList = (list: IList, i?: number): React.JSX.Element => {
    const isLastItem = i !== undefined && i === lists.length - 1;
    const isLastPlaceholder = listDrag.placeholderIndex === lists.length;
    const isDraggingAllowed = lists.length > 1;
    const isCardDragAllowed = lists.length > 1 || list.cards.length > 1;

    return (
      <React.Fragment key={list.id}>
        {isDraggingAllowed && listDrag.placeholderIndex === i && (
          <Placeholder height={listDrag.draggingItemHeight} width={listDrag.draggingItemWidth} />
        )}

        <List
          list={list}
          onUpdateTitle={async (data): Promise<void> => onUpdateList(list.id, data)}
          onDeleteList={onDeleteList}
          isDeleting={isListDeleting || isBoardDeleting}
          registerList={(node: HTMLDivElement | null): void => {
            if (i !== undefined) {
              listDrag.registerItem(node, list);
              cardDrag.registerContainer(node, list);
            }
          }}
          registerDragging={(node: HTMLDivElement | null): void => listDrag.registerDraggingItem(node, list)}
          onDragCb={listDrag.onDragItem}
          isDraggingOver={listDrag.draggingOverIds.has(list.id)}
          isDraggingAllowed={isDraggingAllowed}
          isCardDragAllowed={isCardDragAllowed}
          cardUseDrag={cardDrag}
          onDeleteCard={onDeleteCard}
          isCardDeleting={isCardDeleting}
          onUpdateCard={onUpdateCard}
          openCreateCardModal={(): void =>
            openCreateCardModal({
              list_id: list.id,
              position: list.cards.length,
            })
          }
        />

        {isDraggingAllowed && isLastItem && isLastPlaceholder && (
          <Placeholder height={listDrag.draggingItemHeight} width={listDrag.draggingItemWidth} />
        )}
      </React.Fragment>
    );
  };

  const currentDndState = useMemo((): DndConfig | null => {
    if (listDrag.isDragging) {
      return {
        type: DRAG_EL_TYPE.LIST,
        placeholderPosition: listDrag.placeholderIndex,
        targetContainerId: listDrag.targetContainerId,
        overIds: listDrag.draggingOverIds,
      };
    }
    if (cardDrag.isDragging) {
      return {
        type: DRAG_EL_TYPE.CARD,
        placeholderPosition: cardDrag.placeholderIndex,
        targetContainerId: cardDrag.targetContainerId,
        overIds: cardDrag.draggingOverIds,
      };
    }
    return null;
  }, [listDrag, cardDrag]);

  return (
    <>
      <div className={classes.lists}>
        {lists.length > 0 ? lists.map(renderList) : <p className={classes.emptyMessage}>No lists yet</p>}
      </div>
      {IS_DEBUG && <DndDebugOverlay {...currentDndState} />}
    </>
  );
}

export default BoardLists;
