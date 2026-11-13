import { useState, FocusEvent, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useFormData, FormConfig } from '../useFormData';
import { ValidationErrors } from '../useFormData/types';
import { getByPath, deepClone } from '../../utils/objects';

function useEditForm<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>,
  updateData: (data: T) => Promise<void>
): {
  values: T;
  errors: ValidationErrors<T>;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | string) => Promise<boolean>;
  discardChanges: () => void;
} {
  const initialValuesRef = useRef<T>(deepClone(initialValues));

  const { values, errors, onInputChange, validateField, getPartialValue, resetData, cleanErrors } = useFormData<T>(
    initialValues,
    config
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentJson = JSON.stringify(initialValuesRef.current);
    const newJson = JSON.stringify(initialValues);

    if (currentJson !== newJson) {
      const cloned = deepClone(initialValues);
      initialValuesRef.current = cloned;
      resetData(cloned);
    }
  }, [initialValues, resetData]);

  const discardChanges = (): void => {
    resetData(deepClone(initialValuesRef.current));
    cleanErrors();
  };

  const submit = async (
    e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement> | string
  ): Promise<boolean> => {
    const name = typeof e === 'string' ? e : e?.currentTarget?.name || '';
    if (!name || !validateField(name)) {
      return false;
    }
    const newData = getByPath<T>(values, name);
    const oldData = getByPath<T>(initialValuesRef.current, name);
    if (newData === oldData) {
      return true;
    }

    setIsLoading(true);
    try {
      await updateData(getPartialValue(name));
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    errors,
    isLoading,
    onInputChange,
    submit,
    discardChanges,
  };
}

export default useEditForm;
