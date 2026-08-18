import IList from '../IList';

type BoardDto = {
  title: string;
  custom: {
    background: string;
  };
  lists: IList[];
};

type CreateBoardDto = Omit<CreateBoardDto, 'lists'>;

type UpdateBoardDto = Omit<CreateBoardDto, 'lists'>;

export { BoardDto, CreateBoardDto, UpdateBoardDto };
