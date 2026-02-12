import { getOptionalBooleanInput, getOptionalMultilineInput, getOptionalStringInput, } from '../lib/utils.js';
export function getInvokeSessionInputs() {
    return {
        token: getOptionalStringInput('api-token'),
        outputsDir: getOptionalStringInput('outputs-dir'),
        outputs: getOptionalStringInput('outputs'),
        recordVideo: getOptionalBooleanInput('record-video'),
        devices: getOptionalMultilineInput('devices'),
        maxTimeLimit: getOptionalStringInput('max-time-limit'),
        adbEnabled: getOptionalBooleanInput('adb'),
        adbBinary: getOptionalStringInput('adb-binary'),
        proxyHost: getOptionalStringInput('proxy-host'),
        proxyPort: getOptionalStringInput('proxy-port'),
        proxyUser: getOptionalStringInput('proxy-user'),
        proxyPass: getOptionalStringInput('proxy-password'),
        dnsServers: getOptionalMultilineInput('dns-server'),
        dnsOverrides: getOptionalMultilineInput('dns-override'),
        egressTunnel: getOptionalBooleanInput('egress-tunnel'),
        egressLocalhostFwdIp: getOptionalStringInput('egress-localhost-fwd-ip'),
    };
}
//# sourceMappingURL=inputs.js.map