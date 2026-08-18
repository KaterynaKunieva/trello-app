export class GeneralApiError extends Error {
  public originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
  }
}
