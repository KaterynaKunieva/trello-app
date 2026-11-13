import React from 'react';
import classes from './cardform.module.scss';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';
import { CardFormValues, DEFAULT_CREATE_VALUES, VALIDATION_RULES } from '../../data/cardValidation';

type Props = {
  onSubmit: (data: CardFormValues) => Promise<void>;
  initialValues?: CardFormValues;
  submitButtonText?: string;
  onSuccess?: () => void;
};

function CardForm({
  onSubmit,
  initialValues = DEFAULT_CREATE_VALUES,
  submitButtonText = 'Save',
  onSuccess,
}: Readonly<Props>): React.JSX.Element {
  const handleSubmit = async (data: CardFormValues): Promise<void> => {
    await onSubmit(data);
    onSuccess?.();
  };

  const { values, errors, isValidForm, isLoading, onInputChange, onBlur, submit } = useCreateForm(
    initialValues,
    VALIDATION_RULES,
    handleSubmit
  );

  return (
    <form className={classes.form} onSubmit={submit}>
      <Input
        text="Title"
        type="text"
        name="title"
        value={values.title}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.title}
      />
      <Input
        text="Description"
        type="text"
        name="description"
        value={values.description ?? ''}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.description}
      />
      <Input
        text="Deadline"
        type="datetime-local"
        name="custom.deadline"
        value={values.custom?.deadline ?? ''}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.custom?.deadline}
      />
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        {submitButtonText}
      </Button>
    </form>
  );
}

export default CardForm;
