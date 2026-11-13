import IBoard from '../types/IBoard';

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

const DEFAULT_VALUES: IBoard = {
  id: '',
  title: '',
  custom: {
    background: '#ffffff',
  },
  lists: [],
};

export { VALIDATION_RULES, DEFAULT_VALUES };
