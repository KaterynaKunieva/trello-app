import { createSlice, createAsyncThunk, isPending, isFulfilled, PayloadAction, isRejected } from '@reduxjs/toolkit';
import IBoard from '../types/IBoard';
import { normalizePositions, PositionsDto } from '../../dnd/utils/reorder';
import { boardService } from './boardService';
import { Id } from '../../../common/interfaces/common';
import { UpdateBoardDto } from '../types/BoardDtos';
import { CreateListDto, UpdateListDto } from '../../lists/types/ListDtos';
import { listService } from '../../lists/data/listService';
import { cardService } from '../../cards/data/cardService';
import { CreateCardDto, UpdateCardDto, UpdateCardPositionDto } from '../../cards/types/CardDtos';

interface BoardState {
  isLoading: boolean;
  error: string | null;
  board: IBoard | null;
}

const initialState: BoardState = {
  isLoading: false,
  error: null,
  board: null,
};

export const fetchBoard = createAsyncThunk<IBoard, Id>('board/fetchBoard', async (boardId: Id) => {
  const data = await boardService.getById(boardId);

  const normalizedLists = normalizePositions(data.lists || []).map((list) => ({
    ...list,
    cards: normalizePositions(list.cards || []),
  }));

  const sortedBoard = {
    ...data,
    lists: normalizePositions(normalizedLists || []),
  };

  return sortedBoard;
});

export const updateBoard = createAsyncThunk<void, { boardId: Id; data: UpdateBoardDto }>(
  'board/updateBoard',
  async ({ boardId, data }, { dispatch }) => {
    await boardService.update(boardId, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const deleteBoard = createAsyncThunk('board/deleteBoard', async (boardId: Id) => {
  await boardService.delete(boardId);
});

export const updateList = createAsyncThunk<void, { boardId: Id; id: Id; data: UpdateListDto }>(
  'board/updateList',
  async ({ boardId, id, data }, { dispatch }): Promise<void> => {
    await listService.update(boardId, id, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const updateLists = createAsyncThunk<void, { boardId: Id; data: PositionsDto[] }>(
  'board/updateLists',
  async ({ boardId, data }, { dispatch }) => {
    await listService.updateLists(boardId, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const createList = createAsyncThunk<void, { boardId: Id; data: CreateListDto }>(
  'board/createList',
  async ({ boardId, data }, { dispatch }) => {
    await listService.create(boardId, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const deleteList = createAsyncThunk<void, { boardId: Id; id: Id }>(
  'board/deleteList',
  async ({ boardId, id }, { dispatch }): Promise<void> => {
    await listService.delete(boardId, id);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const updateCardPositions = createAsyncThunk<void, { boardId: Id; data: UpdateCardPositionDto[] }>(
  'board/updateCardPosition',
  async ({ boardId, data }, { dispatch }) => {
    await cardService.updatePositions(boardId, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const createCard = createAsyncThunk<void, { boardId: Id; data: CreateCardDto }>(
  'board/createCard',
  async ({ boardId, data }, { dispatch }) => {
    await cardService.create(boardId, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const deleteCard = createAsyncThunk<void, { boardId: Id; id: Id }>(
  'board/deleteCard',
  async ({ boardId, id }, { dispatch }) => {
    await cardService.delete(boardId, id);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

export const updateCard = createAsyncThunk<void, { boardId: Id; data: UpdateCardDto }>(
  'board/updateCard',
  async ({ boardId, data }, { dispatch }) => {
    await cardService.update(boardId, data.id, data);
    await dispatch(fetchBoard(boardId)).unwrap();
  }
);

const isBoardAction = (action: PayloadAction): boolean => action.type.startsWith('board/');
const isBoardPending = (action: PayloadAction): boolean => isBoardAction(action) && isPending(action);
const isBoardSettled = (action: PayloadAction): boolean =>
  isBoardAction(action) && (isFulfilled(action) || isRejected(action));

const boardSlice = createSlice({
  name: 'boardSlice',
  initialState,
  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.board = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error downloading board';
      })
      .addMatcher(isBoardPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isBoardSettled, (state) => {
        state.isLoading = false;
      });
  },
});

export default boardSlice.reducer;
export const { setBoard } = boardSlice.actions;
