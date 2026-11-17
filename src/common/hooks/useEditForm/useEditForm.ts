import { useState, FocusEvent, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useFormData, FormConfig } from '../useFormData';
import { FormElement, ValidationErrors } from '../useFormData/types';
import { getByPath, setByPath, deepClone } from '../../utils/objects';

function useEditForm<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>,
  updateData: (data: T) => Promise<void>
): {
  values: T;
  errors: ValidationErrors<T>;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<FormElement>) => void;
  submit: (e: FocusEvent<FormElement> | KeyboardEvent<FormElement> | string) => Promise<boolean>;
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

  const submit = async (e: FocusEvent<FormElement> | KeyboardEvent<FormElement> | string): Promise<boolean> => {
    const name = typeof e === 'string' ? e : e?.currentTarget?.name || '';
    if (!name || !validateField(name)) {
      return false;
    }
    const rawNewData = getByPath<unknown>(values, name);
    const rawOldData = getByPath<unknown>(initialValuesRef.current, name);
    const newData = typeof rawNewData === 'string' ? rawNewData.trim() : rawNewData;
    const oldData = typeof rawOldData === 'string' ? rawOldData.trim() : rawOldData;
    if (newData === oldData) {
      discardChanges();
      return true;
    }

    setIsLoading(true);
    try {
      await updateData(setByPath(getPartialValue(name), name, newData));
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
