import { createSlice, createAsyncThunk, PayloadAction, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { CredentialsDto, TokensDto, UserDto } from '../types/auth.dto';
import { authService } from './auth.service';
import tokenStorage from '../utils/tokenStorage';

interface AuthState {
  tokens: TokensDto | null;
  user: UserDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  tokens: tokenStorage.get(),
  user: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: CredentialsDto): Promise<{ user: UserDto; tokens: TokensDto }> => {
    const tokens = await authService.login(data);
    tokenStorage.store(tokens);
    const users = await authService.getUser(data.email);
    return {
      user: users[0],
      tokens,
    };
  }
);

export const register = createAsyncThunk('auth/register', async (data: CredentialsDto, { dispatch }) => {
  await authService.register(data);
  await dispatch(login(data)).unwrap();
});

export const logoutThunk = createAsyncThunk('auth/logout', () => tokenStorage.clear());

const isAuthAction = (action: PayloadAction): boolean => action.type.startsWith('auth/');
const isAuthPending = (action: PayloadAction): boolean => isAuthAction(action) && isPending(action);
const isAuthSettled = (action: PayloadAction): boolean =>
  isAuthAction(action) && (isFulfilled(action) || isRejected(action));

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.tokens = null;
        state.user = null;
        state.error = null;
      })
      .addMatcher(isAuthPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isAuthSettled, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
