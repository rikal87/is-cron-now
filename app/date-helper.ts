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
  cronParts: Array<Array<number>>,
  matchTime = new Date()
) => {
  const activeCronParts = cronParts.map((times, i) =>
    times.map(time => {
      switch (i) {
        case 0:
          return matchTime.getMinutes() === time ? time : null
        case 1:
          return matchTime.getHours() === time ? time : null
        case 2:
          return matchTime.getDate() === time ? time : null
        case 3:
          return matchTime.getMonth() === time ? time : null
        case 4:
          return matchTime.getDay() === time ? time : null
        case 5:
          return matchTime.getFullYear() === time ? time : null
      }
    })
  )
  return activeCronParts.map(value => value.filter(value => value !== null))
}
