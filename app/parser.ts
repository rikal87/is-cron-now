import { constraints, PartsType, PartNames } from './constants';
import { getDateOfType } from './date-helper';
import { validateDatePartNumber } from './validator';

const isHyphenRange = (values: string) => values.split('-').length > 1;
const isRepeated = (values: string) => values.split('/').length > 1;
const checkForList = (values: string): [boolean, Array<string>] => {
  const parts = values.split(',');
  return [parts.length > 1, parts];
};

const getHyphenRangeValues = (values: string): Array<string> => {
  const [start, end] = values.split('-');
  const lowEnd = +start;
  const highEnd = +end;
  const list = [];

  for (let i = lowEnd; i <= highEnd; i++) {
    list.push(`${i}`);
  }
  return list;
};

const getRepeatedValues = (values: string, maxValue: number): Array<string> => {
  const [start, ply] = values.split('/');

  const multiplier = +ply;
  const startPos = isNaN(+start) ? 0 : +start;

  let prev = startPos;
  const list = [];
  for (let i = 0; i <= maxValue; i++) {
    prev += multiplier;
    if (prev > maxValue) {
      return list;
    }
    list.push(`${prev}`);
  }
  return list;
};

const parseValue = (type: PartsType, contraint: Array<number>) => (value: string) => {
  const [min, max] = contraint;
  const number = +value;
  return validateDatePartNumber(type, number, min, max);
};

export const parsePart =
  (contraint: Array<number>, type: PartsType) =>
  (values: string, matchTime: Date): Array<number> => {
    const parseAndValidateValue = parseValue(type, contraint);

    if (values === '*') {
      return [getDateOfType(type, matchTime)];
    }

    const [isList, parts] = checkForList(values);
    if (isList) {
      return parts.map((part) => parsePart(contraint, type)(part, matchTime)).reduce((a, b) => (Array.isArray(a) ? a.concat(b) : a));
    }

    if (isHyphenRange(values)) {
      const hyphenParts = getHyphenRangeValues(values);
      return hyphenParts.map(parseAndValidateValue);
    }

    if (isRepeated(values)) {
      const repeatedParts = getRepeatedValues(values, contraint[1]);
      return repeatedParts.map(parseAndValidateValue);
    }

    return [parseAndValidateValue(values)];
  };

export const parseMinute = parsePart(constraints.minute, PartNames.minutes);
export const parseHour = parsePart(constraints.hour, PartNames.hours);
export const parseDayOfMonth = parsePart(constraints.dayOfMonth, PartNames.dayOfMonth);
export const parseMonth = parsePart(constraints.monthOfYear, PartNames.monthOfYear);
export const parseDayOfWeek = parsePart(constraints.dayOfWeek, PartNames.dayOfWeek);
export const parseYear = parsePart(constraints.year, PartNames.year);
