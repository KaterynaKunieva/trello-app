import React from 'react';
import { toast } from 'sonner';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import useCreateForm from '../../../../common/hooks/useCreateForm/useCreateForm';
import { useAppDispatch } from '../../../../app/hooks';
import { createBoard } from '../../data/boardsSlice';
import { DEFAULT_VALUES, VALIDATION_RULES } from '../../data/boardValidation';
import { CreateBoardDto } from '../../types/BoardDtos';
import { extractErrorMessage } from '../../../../common/utils/errors';
import { IMAGE_MIME_TYPES } from '../../../../common/constants';

type Props = {
  onSuccess?: () => void;
};

function CreateBoard({ onSuccess }: Readonly<Props>): React.JSX.Element {
  const dispatch = useAppDispatch();

  const create = async (formValues: CreateBoardDto): Promise<void> => {
    try {
      await dispatch(createBoard(formValues)).unwrap();
      toast.success('Board created successfully');
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(`Error creating board: ${extractErrorMessage(err)}`);
      throw err;
    }
  };

  const { values, errors, isValidForm, isLoading, onInputChange, onBlur, submit } = useCreateForm<CreateBoardDto>(
    DEFAULT_VALUES,
    VALIDATION_RULES,
    create
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
      <Input
        text="Background"
        type="color"
        value={values.custom?.background ?? ''}
        onChange={onInputChange}
        onBlur={onBlur}
        name="custom.background"
        error={errors?.custom?.background}
      />
      <Input type="file" accept={IMAGE_MIME_TYPES} onChange={onInputChange} name="custom.background" />
      <Button disabled={isLoading || !isValidForm} type="submit" variant="secondary">
        Create
      </Button>
    </form>
  );
}

export default CreateBoard;
