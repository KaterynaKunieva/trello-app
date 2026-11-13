import api from '../../../api/request';
import { CreateBoardDto, UpdateBoardDto } from '../types/BoardDtos';
import IBoard from '../types/IBoard';
import { Id } from '../../../common/interfaces/common';

export const boardService = {
  getAll: (): Promise<{ boards: IBoard[] }> => api.get<{ boards: IBoard[] }>('/board'),
  getById: (id: Id): Promise<IBoard> => api.get<IBoard>(`/board/${id}`),
  create: (data: CreateBoardDto): Promise<void> => api.post('/board', data),
  update: (id: Id, data: UpdateBoardDto): Promise<void> => api.put(`/board/${id}`, data),
  delete: (id: Id): Promise<void> => api.delete(`/board/${id}`),
};
