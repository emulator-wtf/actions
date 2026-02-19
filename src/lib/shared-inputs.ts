import {
  getOptionalBooleanInput,
  getOptionalMultilineInput,
  getOptionalStringInput
} from './utils.js';

/**
 * Inputs related to configuring how the CLI connects to the network,
 * e.g., proxy settings and such. Used only by the CLI.
 */
export interface CliNetworkInputs {
  proxyHost?: string
  proxyPort?: string
  proxyUser?: string
  proxyPass?: string
}

/**
 * Inputs related to configuring the number of devices and their specific settings,
 * e.g., egress tunnel, DNS, and so on.
 */
export interface EmulatorConfigInputs {
  devices?: string[]

  dnsServers?: string[]
  dnsOverrides?: string[]
  egressTunnel?: boolean
  egressLocalhostFwdIp?: string
}

export function getCliNetworkInputs(): CliNetworkInputs {
  return {
    proxyHost: getOptionalStringInput('proxy-host'),
    proxyPort: getOptionalStringInput('proxy-port'),
    proxyUser: getOptionalStringInput('proxy-user'),
    proxyPass: getOptionalStringInput('proxy-password'),
  }
}

export function getEmulatorConfigInputs(): EmulatorConfigInputs {
  return {
    devices: getOptionalMultilineInput('devices'),
    dnsServers: getOptionalMultilineInput('dns-server'),
    dnsOverrides: getOptionalMultilineInput('dns-override'),
    egressTunnel: getOptionalBooleanInput('egress-tunnel'),
    egressLocalhostFwdIp: getOptionalStringInput('egress-localhost-fwd-ip'),
  }
}

export function appendCliNetworkInputsToArgs(inputs: CliNetworkInputs, args: string[]): void {
  if (inputs.proxyHost !== undefined) {
    args.push('--proxy-host', inputs.proxyHost)
  }

  if (inputs.proxyPort !== undefined) {
    args.push('--proxy-port', inputs.proxyPort)
  }

  if (inputs.proxyUser !== undefined) {
    args.push('--proxy-user', inputs.proxyUser)
  }

  if (inputs.proxyPass !== undefined) {
    args.push('--proxy-password', inputs.proxyPass)
  }
}

export function appendEmulatorConfigInputsToArgs(inputs: EmulatorConfigInputs, args: string[]): void {
  if (inputs.devices !== undefined) {
    inputs.devices.forEach(device => {
      args.push('--device', device)
    });
  }

  if (inputs.dnsServers !== undefined) {
    inputs.dnsServers.forEach(server => {
      args.push('--dns-server', server)
    });
  }

  if (inputs.dnsOverrides !== undefined) {
    inputs.dnsOverrides.forEach(override => {
      args.push('--dns-override', override)
    });
  }

  if (inputs.egressTunnel === true) {
    args.push('--egress-tunnel')
  }

  if (inputs.egressLocalhostFwdIp !== undefined) {
    args.push('--egress-localhost-fwd-ip', inputs.egressLocalhostFwdIp)
  }
}