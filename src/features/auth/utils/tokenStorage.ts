import { TokensDto } from '../types/auth.dto';

const KEY = 'auth.tokens';
const storage = localStorage;

const tokenStorage = {
  store(tokens: TokensDto): void {
    storage.setItem(KEY, JSON.stringify(tokens));
  },
  get(): TokensDto | null {
    const tokens = storage.getItem(KEY);
    return tokens === null ? tokens : JSON.parse(tokens);
  },
  clear(): void {
    storage.removeItem(KEY);
  },
};

export default tokenStorage;
