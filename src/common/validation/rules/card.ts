import { dateTimeIntoInputValue } from '../../utils/datetime';
import { CreateCardDto } from '../../interfaces/dtos/CardDtos';

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

const DEFAULT_VALUES: CreateCardDto = {
  title: '',
  position: 0,
  description: '',
  custom: {
    deadline: dateTimeIntoInputValue(new Date()),
  },
};

export { VALIDATION_RULES, DEFAULT_VALUES };
