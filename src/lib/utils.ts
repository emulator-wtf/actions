import {getBooleanInput, getInput, getMultilineInput} from '@actions/core';

export function getOptionalStringInput(name: string): string | undefined {
  const value = getInput(name)
  return undefinedIfEmpty(value)
}

export function getOptionalBooleanInput(name: string): boolean | undefined {
  const value = getOptionalStringInput(name)
  if (value !== undefined) {
    return getBooleanInput(name)
  }
  return undefined
}

export function getOptionalMultilineInput(name: string): string[] | undefined {
  const value = getMultilineInput(name).filter(x => x.length > 0)
  if (value.length > 0) {
    return value
  }
  return undefined
}

export function undefinedIfEmpty(value: string | undefined): string | undefined {
  if (value == null || value.trim() === '') {
    return undefined
  }
  return value
}
