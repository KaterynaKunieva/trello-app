import React from 'react';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';
import { CreateListDto } from '../../types/ListDtos';
import { DEFAULT_VALUES, VALIDATION_RULES } from '../../data/listValidation';

type Props = {
  onSubmit: (data: CreateListDto) => Promise<void>;
  onSuccess?: () => void;
};

function CreateList({ onSubmit, onSuccess }: Readonly<Props>): React.JSX.Element {
  const handleSubmit = async (data: CreateListDto): Promise<void> => {
    await onSubmit(data);
    onSuccess?.();
  };

  const { values, errors, isValidForm, isLoading, onInputChange, onBlur, submit } = useCreateForm(
    DEFAULT_VALUES,
    VALIDATION_RULES,
    handleSubmit
  );

  return (
    <form onSubmit={submit}>
      <Input
        text="Title"
        type="text"
        name="title"
        value={values.title}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.title}
      />
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        Create
      </Button>
    </form>
  );
}

export default CreateList;
