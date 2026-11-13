import { Id } from '../../../common/interfaces/common';
import { PositionsDto } from '../../dnd/utils/reorder';
import { CreateListDto, UpdateListDto } from '../types/ListDtos';
import IList from '../types/IList';
import api from '../../../api/request';

export const listService = {
  create: (boardId: Id, data: CreateListDto): Promise<IList> => api.post<IList>(`/board/${boardId}/list`, data),
  updateLists: (boardId: Id, data: PositionsDto[]): Promise<void> => api.put(`/board/${boardId}/list`, data),
  update: (boardId: Id, listId: Id, data: UpdateListDto): Promise<void> =>
    api.put(`/board/${boardId}/list/${listId}`, data),
  delete: (boardId: Id, listId: Id): Promise<void> => api.delete(`/board/${boardId}/list/${listId}`),
};
