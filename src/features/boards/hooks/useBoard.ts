import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UpdateBoardDto } from '../types/BoardDtos';
import IBoard from '../types/IBoard';
import { calculateNewPositions } from '../../dnd/utils/reorder';
import IList from '../../lists/types/IList';
import { CreateListDto, ReorderListAction, UpdateListDto } from '../../lists/types/ListDtos';
import ICard from '../../cards/types/ICard';
import { Id } from '../../../common/interfaces/common';
import { CreateCardDto, UpdateCardDto } from '../../cards/types/CardDtos';
import { getCrossListCardUpdates, getDeleteCardUpdates, getSameListCardUpdates } from '../../cards/data/cardPosition';
import { inputValueIntoDateTimeApi } from '../../../common/utils/datetime';
import { extractErrorMessage } from '../../../common/utils/errors';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import * as boardActions from '../data/boardSlice';

type ReturnType = {
  board: IBoard | null;
  isLoading: boolean;
  error: string | null;
  fetchBoard: () => Promise<void>;
  updateBoard: (data: UpdateBoardDto) => Promise<void>;
  deleteBoard: () => Promise<void>;
  createList: (dto: CreateListDto) => Promise<void>;
  updateList: (id: Id, data: UpdateListDto) => Promise<void>;
  deleteList: (id: Id) => Promise<void>;
  updateListPosition: (list: IList, position: number) => Promise<void>;
  createCard: (dto: CreateCardDto) => Promise<void>;
  updateCardPosition: (card: ICard, position: number, listId: Id | null) => Promise<void>;
  deleteCard: (id: Id) => Promise<void>;
  updateCard: (data: UpdateCardDto) => Promise<void>;
};

export function useBoard(boardId: Id): ReturnType {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { board, isLoading, error } = useAppSelector((state) => state.board);

  const fetchBoard = useCallback(async (): Promise<void> => {
    try {
      await dispatch(boardActions.fetchBoard(boardId)).unwrap();
    } catch (err: unknown) {
      toast.error(`Error downloading board: ${extractErrorMessage(err)}`);
    }
  }, [boardId, dispatch]);

  const executeOptimisticUpdate = async (
    optimisticUpdate: (prev: IBoard) => IBoard,
    asyncTask: () => Promise<void>
  ): Promise<void> => {
    if (!board) return;
    const rollbackBoard = board;
    dispatch(boardActions.setBoard(optimisticUpdate(board)));
    try {
      await asyncTask();
    } catch (err: unknown) {
      dispatch(boardActions.setBoard(rollbackBoard));
      throw err;
    }
  };

  const updateBoard = async (data: UpdateBoardDto): Promise<void> => {
    try {
      await dispatch(boardActions.updateBoard({ boardId, data })).unwrap();
      toast.success('Board updated successfully');
    } catch (err: unknown) {
      toast.error(`Error updating board: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const deleteBoard = async (): Promise<void> => {
    try {
      await dispatch(boardActions.deleteBoard(boardId)).unwrap();
      navigate('/', { replace: true });
      toast.success('Board deleted successfully');
    } catch (err: unknown) {
      toast.error(`Error deleting board: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const updateList = async (id: Id, data: UpdateListDto): Promise<void> => {
    try {
      await dispatch(boardActions.updateList({ boardId, id, data })).unwrap();
      toast.success('List title updated successfully');
    } catch (err: unknown) {
      toast.error(`Error updating list: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const handleListActionWithPosition = async (
    action: ReorderListAction,
    apiMutation?: () => Promise<void>
  ): Promise<void> => {
    if (!board) return;
    const { updatedItems, updatesForApi } = calculateNewPositions(board.lists, action);

    await executeOptimisticUpdate(
      (prev) => ({ ...prev, lists: updatedItems }),
      async () => {
        await apiMutation?.();
        if (updatesForApi.length > 0) {
          await dispatch(boardActions.updateLists({ boardId, data: updatesForApi })).unwrap();
        }
      }
    );
  };

  const createList = async (dto: CreateListDto): Promise<void> => {
    if (!boardId || !board) return;

    const nextPosition = board.lists.length;
    const fullDto: CreateListDto = { ...dto, position: nextPosition };

    const action: ReorderListAction = {
      type: 'CREATE',
      payload: {
        id: Date.now(),
        item: {
          ...fullDto,
          id: Date.now(),
          cards: [],
        },
      },
    };

    const mutationFn = async (): Promise<void> => {
      await dispatch(boardActions.createList({ boardId, data: fullDto })).unwrap();
    };

    try {
      await handleListActionWithPosition(action, mutationFn);
      toast.success('List created successfully');
    } catch (err: unknown) {
      toast.error(`Error creating list: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const deleteList = async (id: Id): Promise<void> => {
    if (!boardId || Number.isNaN(id)) return;
    const action: ReorderListAction = {
      type: 'DELETE',
      payload: { id },
    };

    const mutationFn = async (): Promise<void> => {
      await dispatch(boardActions.deleteList({ boardId, id })).unwrap();
    };
    try {
      await handleListActionWithPosition(action, mutationFn);
      toast.success('List deleted successfully');
    } catch (err: unknown) {
      toast.error(`Error deleting list: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  // drag-n-drop
  const updateListPosition = async (list: IList, position: number): Promise<void> => {
    if (list.position === position) return;
    const action: ReorderListAction = {
      type: 'REORDER',
      payload: {
        id: list.id,
        oldPosition: list.position,
        newPosition: position,
      },
    };
    try {
      await handleListActionWithPosition(action);
    } catch (err: unknown) {
      toast.error(`Error updating lists: ${extractErrorMessage(err)}`);
    }
  };

  const reorderCardInSameList = async (list: IList, card: ICard, newPosition: number): Promise<void> => {
    const { updatedCards, apiUpdates } = getSameListCardUpdates(list, card.id, card.position, newPosition);

    await executeOptimisticUpdate(
      (prev) => ({
        ...prev,
        lists: prev.lists.map((l) => (l.id === list.id ? { ...l, cards: updatedCards } : l)),
      }),
      async () => {
        if (apiUpdates.length > 0) {
          await dispatch(boardActions.updateCardPositions({ boardId, data: apiUpdates })).unwrap();
        }
      }
    );
  };

  const moveCardBetweenLists = async (
    oldList: IList,
    targetList: IList,
    card: ICard,
    newPosition: number
  ): Promise<void> => {
    const { oldListUpdatedCards, targetListUpdatedCards, allApiUpdates } = getCrossListCardUpdates(
      oldList,
      targetList,
      card,
      newPosition
    );

    await executeOptimisticUpdate(
      (prev) => ({
        ...prev,
        lists: prev.lists.map((l) => {
          if (l.id === oldList.id) {
            return { ...l, cards: oldListUpdatedCards };
          }
          if (l.id === targetList.id) {
            return { ...l, cards: targetListUpdatedCards };
          }
          return l;
        }),
      }),
      async () => {
        if (allApiUpdates.length > 0) {
          await dispatch(boardActions.updateCardPositions({ boardId, data: allApiUpdates })).unwrap();
        }
      }
    );
  };

  const updateCardPosition = async (card: ICard, position: number, listId: Id | null): Promise<void> => {
    if (listId === null || !board) return;

    const oldList = board.lists.find((list) => list.cards.some((c) => c.id === card.id));
    const oldCard = oldList?.cards.find((c) => c.id === card.id);

    if (!oldList || !oldCard) return;

    const targetList = board.lists.find((l) => l.id === listId);
    if (!targetList) return;

    try {
      if (oldList.id === listId) {
        if (oldCard.position === position) return;
        await reorderCardInSameList(targetList, oldCard, position);
      } else {
        await moveCardBetweenLists(oldList, targetList, oldCard, position);
      }
    } catch (err) {
      toast.error(`Error updating card position: ${extractErrorMessage(err)}`);
    }
  };

  const createCard = async (values: CreateCardDto): Promise<void> => {
    try {
      await dispatch(
        boardActions.createCard({
          boardId,
          data: {
            ...values,
            position: Number(values.position),
            custom: values.custom
              ? {
                  ...values.custom,
                  deadline: inputValueIntoDateTimeApi(values.custom.deadline ?? ''),
                }
              : undefined,
          },
        })
      ).unwrap();
      toast.success('Card created successfully');
    } catch (err: unknown) {
      toast.error(`Error creating card: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const deleteCard = async (id: Id): Promise<void> => {
    if (!board) return;
    const targetList = board.lists.find((list) => list.cards.some((c) => c.id === id));
    if (!targetList) return;

    const { updatedCards, apiUpdates } = getDeleteCardUpdates(targetList, id);

    try {
      await executeOptimisticUpdate(
        (prev) => ({
          ...prev,
          lists: prev.lists.map((l) => (l.id === targetList.id ? { ...l, cards: updatedCards } : l)),
        }),
        async () => {
          await dispatch(boardActions.deleteCard({ boardId, id })).unwrap();
          if (apiUpdates.length > 0) {
            await dispatch(boardActions.updateCardPositions({ boardId, data: apiUpdates })).unwrap();
          }
        }
      );
      toast.success('Card deleted successfully');
    } catch (err) {
      toast.error(`Error deleting card: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const updateCard = async (data: UpdateCardDto): Promise<void> => {
    try {
      await dispatch(boardActions.updateCard({ boardId, data })).unwrap();
      toast.success('Card updated successfully');
    } catch (err: unknown) {
      toast.error(`Error updating card: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  return {
    board,
    isLoading,
    error,
    fetchBoard,
    updateBoard,
    deleteBoard,
    createList,
    updateList,
    deleteList,
    updateListPosition,
    createCard,
    updateCardPosition,
    deleteCard,
    updateCard,
  };
}
