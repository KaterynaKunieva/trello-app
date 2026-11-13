import { Id } from '../../../common/interfaces/common';
import IBoard from './IBoard';

type CreateBoardDto = Omit<IBoard, 'id' | 'lists' | 'created_at'>;

type UpdateBoardDto = Partial<CreateBoardDto> & { id: Id };

export { CreateBoardDto, UpdateBoardDto };
