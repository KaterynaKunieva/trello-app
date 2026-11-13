import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import IBoard from '../types/IBoard';
import { boardService } from './boardService';
import { CreateBoardDto } from '../types/BoardDtos';

interface BoardsState {
  isLoading: boolean;
  error: string | null;
  boards: IBoard[] | null;
}

const initialState: BoardsState = {
  isLoading: false,
  error: null,
  boards: null,
};

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const data = await boardService.getAll();
  return data?.boards || [];
});

export const createBoard = createAsyncThunk('boards/createBoard', async (data: CreateBoardDto, { dispatch }) => {
  await boardService.create(data);
  await dispatch(fetchBoards()).unwrap();
});

const isBoardsAction = (action: PayloadAction): boolean => action.type.startsWith('boards/');
const isBoardsPending = (action: PayloadAction): boolean => isBoardsAction(action) && isPending(action);
const isBoardsSettled = (action: PayloadAction): boolean =>
  isBoardsAction(action) && (isFulfilled(action) || isRejected(action));

const boardsSlice = createSlice({
  name: 'boardsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.error = action.error.message ?? 'Error loading boards';
      })
      .addMatcher(isBoardsPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isBoardsSettled, (state) => {
        state.isLoading = false;
      });
  },
});

export default boardsSlice.reducer;
