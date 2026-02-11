import { getBooleanInput, getInput, getMultilineInput, setFailed, warning, info, saveState, setOutput } from '@actions/core';
import { spawn } from 'node:child_process';
const WAIT_TIMEOUT = 60000;
async function invoke() {
    try {
        const token = getInput('api-token');
        const outputsDir = getInput('outputs-dir');
        const outputs = getInput('outputs');
        const recordVideo = getInput('record-video') && getBooleanInput('record-video');
        const devices = getMultilineInput('devices').filter(x => x.length > 0);
        const maxTimeLimit = getInput('max-time-limit');
        const adbEnabled = getInput('adb') && getBooleanInput('adb');
        const adbBinary = getInput('adb-binary');
        const proxyHost = getInput('proxy-host');
        const proxyPort = getInput('proxy-port');
        const proxyUser = getInput('proxy-user');
        const proxyPass = getInput('proxy-password');
        const dnsServers = getMultilineInput('dns-server').filter(x => x.length > 0);
        const dnsOverrides = getMultilineInput('dns-override').filter(x => x.length > 0);
        const egressTunnel = getInput('egress-tunnel') && getBooleanInput('egress-tunnel');
        const egressLocalhostFwdIp = getInput('egress-localhost-fwd-ip');
        const args = ['start-session', '--json'];
        if (token === '' && process.env['EW_API_TOKEN'] === undefined) {
            warning('api-token or EW_API_TOKEN env var must be specified');
            setFailed('api-token or EW_API_TOKEN env var must be specified');
            return;
        }
        if (token !== '') {
            args.push('--token', token);
        }
        if (outputsDir) {
            args.push('--outputs-dir', outputsDir);
        }
        if (outputs) {
            args.push('--outputs', outputs);
        }
        if (recordVideo) {
            args.push('--record-video');
        }
        if (devices) {
            devices.forEach(device => {
                args.push('--device', device);
            });
        }
        if (maxTimeLimit) {
            args.push('--max-time-limit', maxTimeLimit);
        }
        if (!adbEnabled) {
            args.push("--no-adb");
        }
        if (adbBinary) {
            args.push('--adb-binary', adbBinary);
        }
        if (proxyHost) {
            args.push('--proxy-host', proxyHost);
        }
        if (proxyPort) {
            args.push('--proxy-port', proxyPort);
        }
        if (proxyUser) {
            args.push('--proxy-user', proxyUser);
        }
        if (proxyPass) {
            args.push('--proxy-password', proxyPass);
        }
        if (dnsServers.length > 0) {
            dnsServers.forEach(server => {
                args.push('--dns-server', server);
            });
        }
        if (dnsOverrides.length > 0) {
            dnsOverrides.forEach(override => {
                args.push('--dns-override', override);
            });
        }
        if (egressTunnel) {
            args.push('--egress-tunnel');
        }
        if (egressLocalhostFwdIp) {
            args.push('--egress-localhost-fwd-ip', egressLocalhostFwdIp);
        }
        info(`Starting ew-cli`);
        const ewCli = spawn('ew-cli', args);
        const stdout = ewCli.stdout;
        const stderr = ewCli.stderr;
        stdout.on('data', (data) => {
            info(`${data}`);
        });
        stderr.on('data', (data) => {
            info(`${data}`);
        });
        const adbPorts = await waitForJson(stdout, adbEnabled, devices.length);
        info("Finished waiting for adb");
        setOutputs(adbPorts);
        saveState("ew_cli_pid", ewCli.pid);
        ewCli.unref();
        process.exit(0);
    }
    catch (e) {
        warning(`ew-cli invoke failed: ${e}`);
        setFailed(e);
    }
}
function setOutputs(adbPorts) {
    if (adbPorts === null) {
        return;
    }
    setOutput('adb_attached', adbPorts.attachedEvents.map((v) => v.port).join(','));
    setOutput('adb_attached_json', JSON.stringify(adbPorts.attachedEvents));
    setOutput('adb_port_forwarded', adbPorts.forwardedEvents.map((v) => v.port).join(','));
    setOutput('adb_port_forwarded_json', JSON.stringify(adbPorts.forwardedEvents));
}
function waitForJson(stdout, adbEnabled, numberOfDevices) {
    return new Promise((resolve, _) => {
        let attachedEvents = [];
        let forwardedEvents = [];
        stdout.on('data', (data) => {
            try {
                let ewCliEvent = JSON.parse(data);
                switch (ewCliEvent.type) {
                    case 'adb_attached':
                        attachedEvents.push(ewCliEvent);
                        break;
                    case 'adb_port_forwarded':
                        forwardedEvents.push(ewCliEvent);
                        break;
                }
                const size = adbEnabled ? attachedEvents.length : forwardedEvents.length;
                if (size >= numberOfDevices) {
                    resolve({ attachedEvents, forwardedEvents });
                }
            }
            catch (e) {
                warning(e);
            }
        });
        setTimeout(() => resolve(null), WAIT_TIMEOUT);
    });
}
invoke();
//# sourceMappingURL=invoke-session-main.js.map