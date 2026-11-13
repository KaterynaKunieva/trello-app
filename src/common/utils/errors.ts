import axios from 'axios';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please, try again later';

type ApiError = {
  error?: string;
};

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return FALLBACK_ERROR_MESSAGE;
}

function isNotEmptyString(strToTest: unknown): boolean {
  return typeof strToTest === 'string' && strToTest.trim() !== '';
}

function processErrorMessage(err: unknown): string {
  let result = FALLBACK_ERROR_MESSAGE;

  if (axios.isAxiosError<ApiError>(err)) {
    const serverMessage = err.response?.data?.error;

    if (serverMessage && isNotEmptyString(serverMessage)) {
      result = serverMessage;
    } else if (isNotEmptyString(err.message)) {
      result = err.message;
    }
  } else if (err instanceof Error && isNotEmptyString(err.message)) {
    result = err.message;
  } else if (typeof err === 'string' && isNotEmptyString(err)) {
    result = err;
  }

  return result;
}

export { extractErrorMessage, processErrorMessage };
