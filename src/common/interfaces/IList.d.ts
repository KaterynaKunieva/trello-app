import ICard from './ICard';

interface IList {
  id: number;
  title: string;
  cards: ICard[];
}

export default IList;
