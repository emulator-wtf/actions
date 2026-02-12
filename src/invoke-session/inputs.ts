import {
  getOptionalBooleanInput,
  getOptionalMultilineInput,
  getOptionalStringInput,
} from '../lib/utils.js'

export interface InvokeSessionInputs {
  token?: string
  outputsDir?: string
  outputs?: string
  recordVideo?: boolean

  devices?: string[]
  maxTimeLimit?: string
  adbEnabled?: boolean
  adbBinary?: string

  proxyHost?: string
  proxyPort?: string
  proxyUser?: string
  proxyPass?: string

  dnsServers?: string[]
  dnsOverrides?: string[]
  egressTunnel?: boolean
  egressLocalhostFwdIp?: string
}

export function getInvokeSessionInputs(): InvokeSessionInputs {
  return {
    token: getOptionalStringInput('api-token'),
    outputsDir: getOptionalStringInput('outputs-dir'),
    outputs: getOptionalStringInput('outputs'),
    recordVideo: getOptionalBooleanInput('record-video'),

    devices: getOptionalMultilineInput('devices'),
    maxTimeLimit: getOptionalStringInput('max-time-limit'),
    adbEnabled: getOptionalBooleanInput('adb'),
    adbBinary: getOptionalStringInput('adb-binary'),

    proxyHost:  getOptionalStringInput('proxy-host'),
    proxyPort: getOptionalStringInput('proxy-port'),
    proxyUser: getOptionalStringInput('proxy-user'),
    proxyPass: getOptionalStringInput('proxy-password'),

    dnsServers: getOptionalMultilineInput('dns-server'),
    dnsOverrides: getOptionalMultilineInput('dns-override'),
    egressTunnel: getOptionalBooleanInput('egress-tunnel'),
    egressLocalhostFwdIp: getOptionalStringInput('egress-localhost-fwd-ip'),
  }
}
