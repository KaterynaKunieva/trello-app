import { Id } from '../../../common/interfaces/common';
import { CreateCardDto, UpdateCardDto, UpdateCardPositionDto } from '../types/CardDtos';
import api from '../../../api/request';

export const cardService = {
  create: (boardId: Id, data: CreateCardDto): Promise<void> => api.post(`/board/${boardId}/card`, data),
  update: (boardId: Id, cardId: Id, data: Partial<UpdateCardDto>): Promise<void> =>
    api.put(`/board/${boardId}/card/${cardId}`, data),
  updatePositions: (boardId: Id, data: UpdateCardPositionDto[]): Promise<void> =>
    api.put(`/board/${boardId}/card`, data),
  delete: (boardId: Id, cardId: Id): Promise<void> => api.delete(`/board/${boardId}/card/${cardId}`),
};
