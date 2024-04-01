import { PartsType } from './constants';

export const validateDatePartNumber = (type: PartsType, value: number, min: number, max: number) => {
  if (value >= min && value <= max && !isNaN(value)) {
    return value;
  }

  const error = new Error(`parse error: type: ${type} value: ${value}`);
  error.name = 'CronParseError';
  throw error;
};
