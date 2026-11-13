import { Id } from '../../../common/interfaces/common';

interface ICard {
  id: Id;
  title: string;
  position: number;
  description: string;
  color: string;
  list_id: Id;
  custom?: {
    deadline?: string;
  };
  created_at: Date;
}

export default ICard;
