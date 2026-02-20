import { getOptionalBooleanInput, getOptionalMultilineInput, getOptionalStringInput, } from "./utils.js";
export function getCliNetworkInputs() {
    return {
        proxyHost: getOptionalStringInput("proxy-host"),
        proxyPort: getOptionalStringInput("proxy-port"),
        proxyUser: getOptionalStringInput("proxy-user"),
        proxyPass: getOptionalStringInput("proxy-password"),
    };
}
export function getEmulatorConfigInputs() {
    return {
        devices: getOptionalMultilineInput("devices"),
        dnsServers: getOptionalMultilineInput("dns-server"),
        dnsOverrides: getOptionalMultilineInput("dns-override"),
        egressTunnel: getOptionalBooleanInput("egress-tunnel"),
        egressLocalhostFwdIp: getOptionalStringInput("egress-localhost-fwd-ip"),
    };
}
export function appendCliNetworkInputsToArgs(inputs, args) {
    if (inputs.proxyHost !== undefined) {
        args.push("--proxy-host", inputs.proxyHost);
    }
    if (inputs.proxyPort !== undefined) {
        args.push("--proxy-port", inputs.proxyPort);
    }
    if (inputs.proxyUser !== undefined) {
        args.push("--proxy-user", inputs.proxyUser);
    }
    if (inputs.proxyPass !== undefined) {
        args.push("--proxy-password", inputs.proxyPass);
    }
}
export function appendEmulatorConfigInputsToArgs(inputs, args) {
    if (inputs.devices !== undefined) {
        inputs.devices.forEach((device) => {
            args.push("--device", device);
        });
    }
    if (inputs.dnsServers !== undefined) {
        inputs.dnsServers.forEach((server) => {
            args.push("--dns-server", server);
        });
    }
    if (inputs.dnsOverrides !== undefined) {
        inputs.dnsOverrides.forEach((override) => {
            args.push("--dns-override", override);
        });
    }
    if (inputs.egressTunnel === true) {
        args.push("--egress-tunnel");
    }
    if (inputs.egressLocalhostFwdIp !== undefined) {
        args.push("--egress-localhost-fwd-ip", inputs.egressLocalhostFwdIp);
    }
}
