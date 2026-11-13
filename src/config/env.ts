export const ENV = {
  API_URL: process.env.REACT_APP_API_URL || '',
  IS_DEBUG: process.env.REACT_APP_DEBUG === 'true',
} as const;

export const { API_URL, IS_DEBUG } = ENV;
