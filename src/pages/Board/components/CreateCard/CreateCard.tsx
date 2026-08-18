import React, { useCallback } from 'react';
import Form from '../../../../common/components/UI/Form/Form';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import Error from '../../../../common/components/UI/Error/Error';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';
import api from '../../../../api/request';
import { inputValueIntoDateTimeApi } from '../../../../common/utils/datetime';
import { CreateCardDto } from '../../../../common/interfaces/dtos/CardDtos';
import { VALIDATION_RULES, DEFAULT_VALUES } from '../../../../common/validation/rules/card';

type Props = {
  boardId: string;
  listId: number;
  onSuccess?: () => void | Promise<void>;
};

function CreateCard({ boardId, listId, onSuccess }: Props): React.JSX.Element {
  const createCard = useCallback(
    async (values: CreateCardDto): Promise<void> => {
      await api.post(`/board/${boardId}/card`, {
        ...values,
        position: Number(values.position),
        custom: {
          ...values.custom,
          deadline: inputValueIntoDateTimeApi(values.custom.deadline),
        },
        list_id: listId,
      });
      await onSuccess?.();
    },
    [boardId, onSuccess, listId]
  );

  const { values, errors, isValidForm, formError, isLoading, onInputChange, onBlur, submit } =
    useCreateForm<CreateCardDto>(DEFAULT_VALUES, VALIDATION_RULES, createCard);

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
      <Input
        text="Description"
        type="text"
        name="description"
        value={values.description}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.description}
      />
      <Input
        text="Deadline"
        type="datetime-local"
        name="custom.deadline"
        value={values.custom.deadline}
        onChange={onInputChange}
        onBlur={onBlur}
        error={errors?.custom?.deadline}
      />
      <Error>{formError}</Error>
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        Create
      </Button>
    </Form>
  );
}

export default CreateCard;
