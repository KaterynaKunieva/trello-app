import { useCallback, SyntheticEvent, ChangeEvent, FocusEvent } from 'react';
import { toast } from 'sonner';
import { useFormData, FormConfig } from '../useFormData';
import { FormElement, ValidationErrors } from '../useFormData/types';
import useFormSubmit from '../useFormSubmit/useFormSubmit';
import { extractErrorMessage } from '../../../api/utils';

function useCreateForm<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>,
  request: (data: T) => Promise<void>
): {
  values: T;
  errors: ValidationErrors<T>;
  formError: string;
  isValidForm: boolean;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<FormElement>) => void;
  submit: (e?: SyntheticEvent) => Promise<boolean>;
} {
  const { values, errors, onInputChange, onBlur, validateForm, isValidForm, formError, setFormError } = useFormData<T>(
    initialValues,
    config
  );

  const { isLoading, submitWrapper } = useFormSubmit(request);

  const submit = useCallback(
    async (e?: SyntheticEvent): Promise<boolean> => {
      e?.preventDefault();
      setFormError('');
      if (!validateForm()) {
        return false;
      }
      try {
        await submitWrapper(values);
        toast.success(`Created successfully`);
        return true;
      } catch (err: unknown) {
        setFormError(extractErrorMessage(err));
        toast.error(`Error during creation: ${extractErrorMessage(err)}`);
        return false;
      }
    },
    [values, validateForm, submitWrapper, setFormError]
  );

  return {
    values,
    errors,
    formError,
    isValidForm,
    isLoading,
    onInputChange,
    onBlur,
    submit,
  };
}

export default useCreateForm;
