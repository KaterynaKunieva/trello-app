import { dateTimeIntoInputValue } from '../../../common/utils/datetime';
import { CreateCardDto } from '../types/CardDtos';

export type CardFormValues = CreateCardDto;

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

const DEFAULT_CREATE_VALUES: CardFormValues = {
  title: '',
  position: 0,
  list_id: '',
  description: '',
  custom: {
    deadline: dateTimeIntoInputValue(new Date()),
  },
};

export { VALIDATION_RULES, DEFAULT_CREATE_VALUES };
