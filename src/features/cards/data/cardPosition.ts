import { Id } from '../../../common/interfaces/common';
import ICard from '../types/ICard';
import IList from '../../lists/types/IList';
import { ReorderCardAction, UpdateCardPositionDto } from '../types/CardDtos';
import { calculateNewPositions } from '../../dnd/utils/reorder';

export interface SameListCardUpdates {
  updatedCards: ICard[];
  apiUpdates: UpdateCardPositionDto[];
}

export interface CrossListCardUpdates {
  oldListUpdatedCards: ICard[];
  targetListUpdatedCards: ICard[];
  allApiUpdates: UpdateCardPositionDto[];
}

export function getSameListCardUpdates(
  list: IList,
  cardId: Id,
  oldPosition: number,
  newPosition: number
): SameListCardUpdates {
  const action: ReorderCardAction = {
    type: 'REORDER',
    payload: {
      id: cardId,
      oldPosition,
      newPosition,
    },
  };

  const { updatedItems, updatesForApi } = calculateNewPositions(list.cards, action);
  const apiUpdates: UpdateCardPositionDto[] = updatesForApi.map((u) => ({ ...u, list_id: list.id }));

  return { updatedCards: updatedItems, apiUpdates };
}

export function getCrossListCardUpdates(
  oldList: IList,
  targetList: IList,
  card: ICard,
  newPosition: number
): CrossListCardUpdates {
  const deleteAction: ReorderCardAction = {
    type: 'DELETE',
    payload: { id: card.id },
  };
  const { updatedItems: oldListUpdatedCards, updatesForApi: oldListUpdates } = calculateNewPositions(
    oldList.cards,
    deleteAction
  );
  const oldApiUpdates: UpdateCardPositionDto[] = oldListUpdates.map((u) => ({ ...u, list_id: oldList.id }));

  const newItem = { ...card, position: newPosition };
  const createAction: ReorderCardAction = {
    type: 'CREATE',
    payload: {
      id: card.id,
      item: newItem,
    },
  };
  const { updatedItems: targetListUpdatedCards, updatesForApi: targetListUpdates } = calculateNewPositions(
    targetList.cards,
    createAction
  );
  const targetApiUpdates: UpdateCardPositionDto[] = targetListUpdates.map((u) => ({ ...u, list_id: targetList.id }));

  const movedCardUpdate: UpdateCardPositionDto = { id: card.id, position: newPosition, list_id: targetList.id };
  const allApiUpdates: UpdateCardPositionDto[] = [movedCardUpdate, ...oldApiUpdates, ...targetApiUpdates];

  return {
    oldListUpdatedCards,
    targetListUpdatedCards,
    allApiUpdates,
  };
}

export function getDeleteCardUpdates(list: IList, cardId: Id): SameListCardUpdates {
  const action: ReorderCardAction = {
    type: 'DELETE',
    payload: { id: cardId },
  };

  const { updatedItems, updatesForApi } = calculateNewPositions(list.cards, action);
  const apiUpdates: UpdateCardPositionDto[] = updatesForApi.map((u) => ({ ...u, list_id: list.id }));

  return { updatedCards: updatedItems, apiUpdates };
}
