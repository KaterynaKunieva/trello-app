import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import useFormSubmit from '../useFormSubmit/useFormSubmit';
import { extractErrorMessage } from '../../../api/utils';

function useDelete(request: () => Promise<void>): {
  error: string;
  isLoading: boolean;
  submit: () => Promise<void>;
} {
  const { isLoading, submitWrapper } = useFormSubmit(request);
  const [error, setError] = useState('');

  const submit = useCallback(async (): Promise<void> => {
    setError('');
    try {
      await submitWrapper();
      toast.success('Deleted successfully');
    } catch (e: unknown) {
      setError(`Error deleting: ${extractErrorMessage(e)}`);
      toast.error(`Error deleting: ${extractErrorMessage(e)}`);
    }
  }, [submitWrapper]);

  return {
    error,
    isLoading,
    submit,
  };
}

export default useDelete;
