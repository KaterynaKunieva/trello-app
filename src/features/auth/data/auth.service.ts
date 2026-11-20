import api from '../../../api/request';
import { Id } from '../../../common/interfaces/common';
import { CredentialsDto, TokensDto, UserDto } from '../types/auth.dto';

export const authService = {
  register: (data: CredentialsDto): Promise<{ id: Id }> => api.post('/user', data),
  getUser: (emailOrUsername: string): Promise<UserDto[]> => api.get(`/user?emailOrUsername=${emailOrUsername}`),
  login: (data: CredentialsDto): Promise<TokensDto> => api.post('/login', data),
  refresh: (data: Pick<TokensDto, 'refreshToken'>): Promise<TokensDto> => api.post('/refresh', data),
};
