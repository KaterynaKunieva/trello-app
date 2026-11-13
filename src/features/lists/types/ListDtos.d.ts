import { ReorderAction } from '../../dnd/utils/reorder';
import { Id } from '../../../common/interfaces/common';
import IList from './IList';

type CreateListDto = Partial<IList> & {
  title: string;
  position: number;
};

type UpdateListDto = Partial<IList> & { id: Id; board_id?: Id };

type ReorderListAction = ReorderAction<IList>;

export { CreateListDto, UpdateListDto, ReorderListAction };
