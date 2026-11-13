import { Id } from '../../../common/interfaces/common';
import IList from '../../lists/types/IList';

interface IBoard {
  id: Id;
  title: string;
  custom: {
    background: string;
  };
  lists: IList[];
  created_at?: Date;
}

export default IBoard;
