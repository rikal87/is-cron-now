import {constraints, PartsType, PartNames} from './constants'

const getCronParts = (string: string) => {
  const [
    minutes,
    hours,
    dayOfMonth,
    monthOfYear,
    dayOfWeek,
    year
  ] = string.split(' ')

  return {
    minutes,
    hours,
    dayOfMonth,
    monthOfYear,
    dayOfWeek,
    year
  }
}

const removeNonActive = (
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

const getCurrentValue = (type: PartsType, matchTime: Date) => {
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

const getHyphenRangeValues = (values: string): Array<string> => {
  const [start, end] = values.split('-')
  const lowEnd = +start
  const highEnd = +end
  const list = []

  for (let i = lowEnd; i <= highEnd; i++) {
    list.push(`${i}`)
  }
  return list
}

const getRepeatedValues = (values: string, maxValue: number): Array<string> => {
  const [start, ply] = values.split('/')

  const multiplier = +ply
  const startPos = isNaN(+start) ? 0 : +start

  let prev = startPos
  const list = []
  for (let i = 0; i <= maxValue; i++) {
    prev += multiplier
    if (prev >= maxValue) {
      return list
    }
    list.push(`${prev}`)
  }
  return list
}

const isAnyValueEmpty = (collection: Array<Array<number>>) =>
  !!collection.find(values => values.length === 0)

const parse = (contraint: Array<number>, type: PartsType) => (
  values: string,
  matchTime: Date
) => {
  const parseValue = (value: string) => {
    const [low, high] = contraint
    const number = +value

    if (number >= low && number <= high && !isNaN(number)) {
      return number
    }

    throw new Error(`parse error: type: ${type} value: ${number}`)
  }

  if (values === '*') {
    return [getCurrentValue(type, matchTime)]
  }

  const parts = values.split(',')
  if (parts.length > 1) {
    return parts.map(parseValue)
  }

  if (values.split('-').length > 1) {
    const hyphenParts = getHyphenRangeValues(values)
    return hyphenParts.map(parseValue)
  }

  if (values.split('/').length > 1) {
    const repeatedParts = getRepeatedValues(values, contraint[1])
    return repeatedParts.map(parseValue)
  }

  return [parseValue(values)]
}

const parseMinute = parse(constraints.minute, PartNames.minutes)
const parseHour = parse(constraints.hour, PartNames.hours)
const parseDayOfMonth = parse(constraints.dayOfMonth, PartNames.dayOfMonth)
const parseMonth = parse(constraints.monthOfYear, PartNames.monthOfYear)
const parseDayOfWeek = parse(constraints.dayOfWeek, PartNames.dayOfWeek)
const parseYear = parse(constraints.year, PartNames.year)

export const isActive = (cronString: string, matchTime = new Date()) => {
  const cronParts = getCronParts(cronString.trim())

  const minutes = parseMinute(cronParts.minutes, matchTime)
  const hours = parseHour(cronParts.hours, matchTime)
  const daysInMonth = parseDayOfMonth(cronParts.dayOfMonth, matchTime)
  const monthOfYear = parseMonth(cronParts.monthOfYear, matchTime)
  const dayOfWeek = parseDayOfWeek(cronParts.dayOfWeek, matchTime)
  const year = parseYear(cronParts.year, matchTime)

  const activeValues = removeNonActive(
    [minutes, hours, daysInMonth, monthOfYear, dayOfWeek, year],
    matchTime
  )

  if (isAnyValueEmpty(activeValues)) {
    return false
  }
  return true
}
