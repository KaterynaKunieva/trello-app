import { FocusEvent, KeyboardEvent, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useFormData, FormConfig } from '../useFormData';
import useFormSubmit from '../useFormSubmit/useFormSubmit';
import { extractErrorMessage } from '../../../api/utils';
import { ValidationErrors } from '../useFormData/types';
import { getByPath, deepClone } from '../../utils/objects';

function useEditForm<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>,
  fetchData: () => Promise<void>,
  updateData: (data: T) => Promise<void>
): {
  values: T;
  errors: ValidationErrors<T>;
  formError: string;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | string) => Promise<boolean>;
  discardChanges: () => void;
} {
  const initialValuesRef = useRef<T>(deepClone(initialValues));

  const {
    values,
    errors,
    formError,
    onInputChange,
    validateField,
    getPartialValue,
    resetData,
    setFormError,
    cleanErrors,
  } = useFormData<T>(initialValues, config);

  const { isLoading, submitWrapper } = useFormSubmit(updateData);

  useEffect(() => {
    const currentJson = JSON.stringify(initialValuesRef.current);
    const newJson = JSON.stringify(initialValues);

    if (currentJson !== newJson) {
      const cloned = deepClone(initialValues);
      initialValuesRef.current = cloned;
      resetData(cloned);
    }
  }, [initialValues, resetData]);

  const discardChanges = useCallback(() => {
    resetData(deepClone(initialValuesRef.current));
    cleanErrors();
  }, [resetData, cleanErrors]);

  const submit = useCallback(
    async (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | string): Promise<boolean> => {
      const name = typeof e === 'string' ? e : e.currentTarget.name;
      if (!validateField(name)) {
        return false;
      }
      const newData = getByPath<T>(values, name);
      const oldData = getByPath<T>(initialValuesRef.current, name);
      if (newData === oldData) {
        return true;
      }

      try {
        await submitWrapper(getPartialValue(name));
        await fetchData();
        toast.success(`Updated successfully`);
        return true;
      } catch (err: unknown) {
        setFormError(`Error updating ${extractErrorMessage(err)}`);
        toast.error(`Error updating ${extractErrorMessage(err)}`);
        return false;
      }
    },
    [validateField, submitWrapper, setFormError, fetchData, getPartialValue, values]
  );

  return {
    values,
    errors,
    formError,
    isLoading,
    onInputChange,
    submit,
    discardChanges,
  };
}

export default useEditForm;
