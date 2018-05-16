import {constraints, PartsType, PartNames} from './constants'
import {getDateOfType} from './date-helper'

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

export const parse = (contraint: Array<number>, type: PartsType) => (
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
    return [getDateOfType(type, matchTime)]
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

export const parseMinute = parse(constraints.minute, PartNames.minutes)
export const parseHour = parse(constraints.hour, PartNames.hours)
export const parseDayOfMonth = parse(
  constraints.dayOfMonth,
  PartNames.dayOfMonth
)
export const parseMonth = parse(constraints.monthOfYear, PartNames.monthOfYear)
export const parseDayOfWeek = parse(constraints.dayOfWeek, PartNames.dayOfWeek)
export const parseYear = parse(constraints.year, PartNames.year)
