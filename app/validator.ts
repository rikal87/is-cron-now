import {PartsType} from './constants'

export const validateDatePartNumber = (type: PartsType, value: number, min: number, max: number) => {
  if (value >= min && value <= max && !isNaN(value)) {
    return value
  }

  throw new Error(`parse error: type: ${type} value: ${value}`)
}

