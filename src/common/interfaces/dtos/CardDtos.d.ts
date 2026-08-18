type CreateCardDto = {
  title: string;
  position: number;
  description: string;
  custom: {
    deadline: string;
  };
};

type UpdateCardDto = Pick<CreateCardDto, 'title'>;

export { CreateCardDto, UpdateCardDto };
