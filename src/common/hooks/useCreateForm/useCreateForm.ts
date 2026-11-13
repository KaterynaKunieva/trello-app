import { useState, SyntheticEvent, ChangeEvent, FocusEvent } from 'react';
import { useFormData, FormConfig } from '../useFormData';
import { FormElement, ValidationErrors } from '../useFormData/types';

function useCreateForm<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>,
  request: (data: T) => Promise<void>
): {
  values: T;
  errors: ValidationErrors<T>;
  isValidForm: boolean;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<FormElement>) => void;
  submit: (e?: SyntheticEvent) => Promise<void>;
} {
  const { values, errors, onInputChange, onBlur, validateForm, isValidForm } = useFormData<T>(initialValues, config);

  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e?: SyntheticEvent): Promise<void> => {
    e?.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await request(values);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    errors,
    isValidForm,
    isLoading,
    onInputChange,
    onBlur,
    submit,
  };
}

export default useCreateForm;
