import React, { useCallback } from 'react';
import Form from '../../../../common/components/UI/Form/Form';
import Input from '../../../../common/components/UI/Input/Input';
import InputImage from '../../../../common/components/UI/InputImage/InputImage';
import Button from '../../../../common/components/UI/Button/Button';
import Error from '../../../../common/components/UI/Error/Error';
import api from '../../../../api/request';
import { CreateBoardDto } from '../../../../common/interfaces/dtos/BoardDtos';
import { VALIDATION_RULES, DEFAULT_VALUES } from '../../../../common/validation/rules/board';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';

type Props = {
  onSuccess?: () => void;
};

function CreateBoard({ onSuccess }: Props): React.JSX.Element {
  const createBoard = useCallback(
    async (values: CreateBoardDto): Promise<void> => {
      await api.post('/board', values);
      await onSuccess?.();
    },
    [onSuccess]
  );

  const { values, errors, isValidForm, formError, isLoading, onInputChange, onBlur, submit } =
    useCreateForm<CreateBoardDto>(DEFAULT_VALUES, VALIDATION_RULES, createBoard);

  return (
    <Form onSubmit={submit}>
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
        text="Background"
        type="color"
        value={values.custom.background}
        onChange={onInputChange}
        onBlur={onBlur}
        name="custom.background"
        error={errors?.custom?.background}
      />
      <InputImage onChange={onInputChange} name="custom.background" />
      <Error>{formError}</Error>
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        Create
      </Button>
    </Form>
  );
}

export default CreateBoard;
