import { BoardDto } from '../../interfaces/dtos/BoardDtos';

const VALIDATION_RULES = {
  title: {
    rules: {
      required: true,
      pattern: {
        value: /^[A-Za-z_.-\s]+$/,
        message: 'Allowed symbols in title: A-Z, a-z, -._',
      },
    },
  },
};

const DEFAULT_VALUES: BoardDto = {
  title: '',
  custom: {
    background: '#ffffff',
  },
  lists: [],
};

export { VALIDATION_RULES, DEFAULT_VALUES };
