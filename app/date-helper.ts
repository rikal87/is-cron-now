import {PartsType, PartNames} from './constants'

export const getDateOfType = (type: PartsType, matchTime: Date) => {
  switch (type) {
    case PartNames.minutes:
      return matchTime.getMinutes()
    case PartNames.hours:
      return matchTime.getHours()
    case PartNames.dayOfMonth:
      return matchTime.getDate()
    case PartNames.monthOfYear:
      return matchTime.getMonth()
    case PartNames.dayOfWeek:
      return matchTime.getDay()
    case PartNames.year:
      return matchTime.getFullYear()
  }
}

export const getActiveBasedOnDate = (
  data: Array<Array<number>>,
  matchTime = new Date()
) => {
  const checkWithMatchTime = (type: PartsType, time: number) => {
    switch (type) {
      case PartNames.minutes:
        return matchTime.getMinutes() === time ? time : null
      case PartNames.hours:
        return matchTime.getHours() === time ? time : null
      case PartNames.dayOfMonth:
        return matchTime.getDate() === time ? time : null
      case PartNames.monthOfYear:
        return matchTime.getMonth() === time ? time : null
      case PartNames.dayOfWeek: {
        return matchTime.getDay() === time ? time : null
      }
      case PartNames.year:
        return matchTime.getFullYear() === time ? time : null
    }
  }

  const [minutes, hours, daysInMonth, monthOfYear, dayOfWeek, year] = data.map(
    (times, i) =>
      times.map(time => {
        switch (i) {
          case 0:
            return checkWithMatchTime(PartNames.minutes, time)
          case 1:
            return checkWithMatchTime(PartNames.hours, time)
          case 2:
            return checkWithMatchTime(PartNames.dayOfMonth, time)
          case 3:
            return checkWithMatchTime(PartNames.monthOfYear, time)
          case 4:
            return checkWithMatchTime(PartNames.dayOfWeek, time)
          case 5:
            return checkWithMatchTime(PartNames.year, time)
        }
      })
  )
  const removeNull = value => value !== null

  return [
    minutes.filter(removeNull),
    hours.filter(removeNull),
    daysInMonth.filter(removeNull),
    monthOfYear.filter(removeNull),
    dayOfWeek.filter(removeNull),
    year.filter(removeNull)
  ]
}
