import { CreateListDto } from '../../interfaces/dtos/ListDtos';

const DEFAULT_VALUES: CreateListDto = {
  title: '',
  position: 0,
};

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
  position: {
    rules: {
      required: true,
      min: 0,
    },
  },
};

export { DEFAULT_VALUES, VALIDATION_RULES };
