import { Id } from '../../../common/interfaces/common';

export type CredentialsDto = {
  email: string;
  password: string;
};

export type UserDto = { id: Id; username: string };

export type TokensDto = {
  token: string; // auth token
  refreshToken: string;
};
