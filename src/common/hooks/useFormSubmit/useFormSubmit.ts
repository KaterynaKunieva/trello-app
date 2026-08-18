import { useState, useCallback } from 'react';

function useFormSubmit<TData = void, TResult = void>(
  request: (data: TData) => TResult
): {
  isLoading: boolean;
  submitWrapper: (data: TData) => Promise<void>;
} {
  const [isLoading, setIsLoading] = useState(false);

  const submitWrapper = useCallback(
    async (data: TData) => {
      setIsLoading(true);
      try {
        await request(data);
      } finally {
        setIsLoading(false);
      }
    },
    [request]
  );

  return {
    isLoading,
    submitWrapper,
  };
}

export default useFormSubmit;
