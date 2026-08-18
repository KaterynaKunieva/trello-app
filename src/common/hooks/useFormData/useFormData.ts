import { useState, useMemo, useCallback, ChangeEvent, FocusEvent, Dispatch, SetStateAction } from 'react';
import { InputValidationRules, FormElement, FormConfig, ValidationErrors } from './types';
import { getByPath, getPartialObjByPath, setByPath, applyToAllValues } from '../../utils/objects';
import { convertToBase64 } from '../../utils/base64';

export function useFormData<T extends Record<string, unknown>>(
  initialValues: T,
  config: FormConfig<T>
): {
  values: T;
  errors: ValidationErrors<T>;
  isValidForm: boolean;
  formError: string;
  validateField: (name: string) => boolean;
  validateForm: () => boolean;
  onInputChange: (e: ChangeEvent<FormElement>) => Promise<void>;
  onBlur: (e: FocusEvent<FormElement>) => void;
  getPartialValue: (name: string) => T;
  resetData: (newValues: T | ((prev: T) => T)) => void;
  setFormError: Dispatch<SetStateAction<string>>;
  setFieldError: (name: string, err: string) => void;
  cleanErrors: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [formError, setFormError] = useState('');

  function isEmptyValue(value: unknown): boolean {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  const resetData = useCallback((newValues: T | ((prev: T) => T)) => {
    setValues((prev) => {
      if (typeof newValues === 'function') {
        return newValues(prev);
      }
      if (typeof newValues === 'object') {
        return newValues;
      }
      return prev;
    });
  }, []);

  const cleanErrors = useCallback(() => {
    setErrors({});
    setFormError('');
  }, []);

  const setFieldError = useCallback((name: string, err: string): void => {
    setErrors((prev) => setByPath(prev, name, err));
  }, []);

  const getPartialValue = useCallback((name: string): T => getPartialObjByPath(values, name), [values]);

  const isValidForm = useMemo((): boolean => {
    let isValid = true;
    applyToAllValues(errors, (path) => {
      const error = getByPath(errors, path);
      if (isValid && typeof error === 'string' && getByPath(errors, path).trim() !== '') {
        isValid = false;
      }
    });
    return isValid;
  }, [errors]);

  const validateField = useCallback(
    (name: string): boolean => {
      const { rules } = getByPath<{ rules: InputValidationRules }>(config, name);
      const value = getByPath(values, name);

      if (!rules) {
        return true;
      }

      let isValid = true;

      if (rules.required && isEmptyValue(value)) {
        setErrors((prev) => setByPath(prev, name, `${name} is required`));
        isValid = false;
      } else if (rules.pattern) {
        let pattern: RegExp;
        let message: string;
        if (rules.pattern instanceof RegExp) {
          pattern = rules.pattern;
          message = `Invalid ${name}`;
        } else {
          pattern = rules.pattern.value;
          message = rules.pattern.message;
        }
        if (!pattern.test(value)) {
          setErrors((prev) => setByPath(prev, name, message));
          isValid = false;
        }
      }

      if (typeof rules?.min === 'number' && Number(value) < rules.min) {
        isValid = false;
        setErrors((prev) => setByPath(prev, name, `${name} must be at least ${rules.min}`));
      }

      if (typeof rules?.max === 'number' && Number(value) > rules.max) {
        isValid = false;
        setErrors((prev) => setByPath(prev, name, `${name} must be at most ${rules.max}`));
      }

      return isValid;
    },
    [config, values]
  );

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    applyToAllValues(values, (path) => {
      if (isValid && !validateField(path)) {
        isValid = false;
      }
    });
    return isValid;
  }, [values, validateField]);

  const onInputChange = useCallback(
    async (e: ChangeEvent<FormElement>): Promise<void> => {
      const { name, type } = e.target;

      // clean error message
      setFormError('');
      setFieldError(e.target.name, '');

      if (type === 'file') {
        const inputEl = e.target as HTMLInputElement;
        const file = inputEl.files?.[0] || '';
        if (!file) return;
        try {
          const base64String = await convertToBase64(file);
          setValues((prev) => setByPath(prev, name, base64String));
        } catch (err: unknown) {
          setErrors((prev) => setByPath(prev, name, `Error loading image: ${err}`));
        }
      } else {
        // update state
        setValues((prev) => setByPath(prev, name, e.target.value));
      }
    },
    [setFieldError]
  );

  const onBlur = useCallback(
    (e: FocusEvent<FormElement>): void => {
      validateField(e.target.name);
    },
    [validateField]
  );

  return {
    values,
    errors,
    isValidForm,
    formError,
    validateField,
    validateForm,
    onInputChange,
    onBlur,
    getPartialValue,
    resetData,
    setFormError,
    setFieldError,
    cleanErrors,
  };
}
