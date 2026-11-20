import { CredentialsDto } from '../types/auth.dto';

export type RegisterForm = CredentialsDto & { repeat_password: string };

const VALIDATION_RULES = {
  email: {
    rules: {
      required: true,
      // todo: maybe use default browser validation?
    },
  },
  password: {
    rules: {
      required: true,
    },
  },
  repeat_password: {
    rules: {
      required: true,
    },
  },
};

const DEFAULT_LOGIN_VALUES: CredentialsDto = {
  email: '',
  password: '',
};

const DEFAULT_REGISTER_VALUES: RegisterForm = {
  email: '',
  password: '',
  repeat_password: '',
};

// todo: repeate password

export { VALIDATION_RULES, DEFAULT_LOGIN_VALUES, DEFAULT_REGISTER_VALUES };
