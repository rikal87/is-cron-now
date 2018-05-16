export const constraints = {
  minute: [0, 59],
  hour: [0, 23],
  dayOfMonth: [1, 31],
  monthOfYear: [0, 11],
  dayOfWeek: [0, 6],
  year: [1900, 3000]
}

export type PartsType =
  | 'minutes'
  | 'hours'
  | 'dayOfMonth'
  | 'monthOfYear'
  | 'dayOfWeek'
  | 'year'

export const PartNames: {[key: string]: PartsType} = {
  minutes: 'minutes',
  hours: 'hours',
  dayOfMonth: 'dayOfMonth',
  monthOfYear: 'monthOfYear',
  dayOfWeek: 'dayOfWeek',
  year: 'year'
}
