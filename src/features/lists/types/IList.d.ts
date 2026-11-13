import { Id } from '../../../common/interfaces/common';
import ICard from '../../cards/types/ICard';

interface IList {
  id: Id;
  title: string;
  position: number;
  cards: ICard[];
  board_id?: Id;
  created_at?: Date;
}

export default IList;
