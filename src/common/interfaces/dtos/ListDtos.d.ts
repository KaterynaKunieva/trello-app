type CreateListDto = {
  title: string;
  position: number;
};

type UpdateListDto = Pick<CreateListDto, 'title'>;

export { CreateListDto, UpdateListDto };
