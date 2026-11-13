import { configureStore } from '@reduxjs/toolkit';
import currentCardSlice from '../features/cards/data/currentCardSlice';
import boardSlice from '../features/boards/data/boardSlice';
import boardsSlice from '../features/boards/data/boardsSlice';

export const store = configureStore({
  reducer: {
    boards: boardsSlice,
    currentCard: currentCardSlice,
    board: boardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
