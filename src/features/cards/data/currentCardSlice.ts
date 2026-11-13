import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UpdateCardDto } from '../types/CardDtos';

interface CurrentCardState {
  card: UpdateCardDto | null;
}

const initialState: CurrentCardState = {
  card: null,
};

const currentCardSlice = createSlice({
  name: 'currentCardSlice',
  initialState,
  reducers: {
    openCardModal: (state, action: PayloadAction<UpdateCardDto>) => {
      state.card = action.payload;
    },
    closeCardModal: (state) => {
      state.card = null;
    },
  },
});

export const { openCardModal, closeCardModal } = currentCardSlice.actions;
export default currentCardSlice.reducer;
