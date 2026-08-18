import React, { useCallback } from 'react';
import Form from '../../../../common/components/UI/Form/Form';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import Error from '../../../../common/components/UI/Error/Error';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';
import api from '../../../../api/request';
import { CreateListDto } from '../../../../common/interfaces/dtos/ListDtos';
import { VALIDATION_RULES, DEFAULT_VALUES } from '../../../../common/validation/rules/list';

type Props = {
  boardId: string;
  onSuccess?: () => void | Promise<void>;
};

function CreateList({ boardId, onSuccess }: Props): React.JSX.Element {
  const createList = useCallback(
    async (values: CreateListDto): Promise<void> => {
      await api.post(`/board/${boardId}/list`, {
        ...values,
        position: Number(values.position),
      });
      await onSuccess?.();
    },
    [boardId, onSuccess]
  );

  const { values, errors, isValidForm, formError, isLoading, onInputChange, onBlur, submit } =
    useCreateForm<CreateListDto>(DEFAULT_VALUES, VALIDATION_RULES, createList);

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
        text="Position"
        type="number"
        value={values.position}
        onChange={onInputChange}
        onBlur={onBlur}
        name="position"
        error={errors?.position}
      />
      <Error>{formError}</Error>
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        Create
      </Button>
    </Form>
  );
}

export default CreateList;
