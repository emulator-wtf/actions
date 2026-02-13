import {
  getOptionalBooleanInput,
  getOptionalStringInput,
} from '../lib/utils.js'
import {
  type CliNetworkInputs,
  type EmulatorConfigInputs,
  getCliNetworkInputs,
  getEmulatorConfigInputs,
} from '../lib/shared-inputs.js'

export interface InvokeSessionInputs extends CliNetworkInputs, EmulatorConfigInputs {
  token?: string
  outputsDir?: string
  outputs?: string
  recordVideo?: boolean

  maxTimeLimit?: string
  adbEnabled?: boolean
  adbBinary?: string
}

export function getInvokeSessionInputs(): InvokeSessionInputs {
  const cliNetworkInputs = getCliNetworkInputs()
  const emulatorConfigInputs = getEmulatorConfigInputs()

  return {
    token: getOptionalStringInput('api-token'),
    outputsDir: getOptionalStringInput('outputs-dir'),
    outputs: getOptionalStringInput('outputs'),
    recordVideo: getOptionalBooleanInput('record-video'),

    maxTimeLimit: getOptionalStringInput('max-time-limit'),
    adbEnabled: getOptionalBooleanInput('adb'),
    adbBinary: getOptionalStringInput('adb-binary'),

    ...cliNetworkInputs,
    ...emulatorConfigInputs,
  }
}
