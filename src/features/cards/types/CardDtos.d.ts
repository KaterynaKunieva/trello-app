import { ReorderAction } from '../../dnd/utils/reorder';
import { Id } from '../../../common/interfaces/common';
import ICard from './ICard';

type CreateCardDto = Partial<ICard> & {
  title: string;
  position: number;
  list_id: Id;
};

type UpdateCardDto = Partial<ICard> & { id: Id; list_id: Id };

type ReorderCardAction = ReorderAction<ICard>;

type UpdateCardPositionDto = Pick<ICard, 'id' | 'position' | 'list_id'>;

type NewCardTargetInfo = Pick<CreateCardDto, 'list_id' | 'position'>;

export { CreateCardDto, ReorderCardAction, UpdateCardDto, UpdateCardPositionDto, NewCardTargetInfo };
