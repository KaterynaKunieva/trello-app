interface InputValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?:
    | RegExp
    | {
        value: RegExp;
        message: string;
      };
}

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormConfig<T> = {
  [key in keyof T]?: T[key] extends Record<string, unknown> | undefined
    ? FormConfig<NonNullable<T[key]>>
    : { rules: InputValidationRules };
};

type ValidationErrors<T> = {
  [key in keyof T]?: T[key] extends Record<string, unknown> | undefined
    ? ValidationErrors<NonNullable<T[key]>>
    : string;
};

export type { InputValidationRules, FormElement, FormConfig, ValidationErrors };
