import { PartsType, PartNames } from './constants';

export const getDateOfType = (type: PartsType, matchTime: Date) => {
  switch (type) {
    case PartNames.minutes:
      return matchTime.getMinutes();
    case PartNames.hours:
      return matchTime.getHours();
    case PartNames.dayOfMonth:
      return matchTime.getDate();
    case PartNames.monthOfYear:
      return matchTime.getMonth();
    case PartNames.dayOfWeek:
      return matchTime.getDay();
    case PartNames.year:
      return matchTime.getFullYear();
  }
};

export const getActiveBasedOnDate = (cronParts: Array<Array<number>>, matchTime = new Date()) => {
  return cronParts.map((times, i) =>
    times.filter((time) => {
      switch (i) {
        case 0:
          return matchTime.getMinutes() === time;
        case 1:
          return matchTime.getHours() === time;
        case 2:
          return matchTime.getDate() === time;
        case 3:
          return matchTime.getMonth() === time;
        case 4:
          return matchTime.getDay() === time;
        case 5:
          return matchTime.getFullYear() === time;
      }
    }),
  );
};
