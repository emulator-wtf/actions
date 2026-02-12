import { getState, info, saveState, setOutput, warning } from '@actions/core';
import { spawn, spawnSync } from 'node:child_process';
const WAIT_TIMEOUT = 60000;
export async function invokeSession(inputs) {
    try {
        const args = ['start-session', '--json'];
        if (inputs.token === undefined && process.env['EW_API_TOKEN'] === undefined) {
            throw new Error('api-token or EW_API_TOKEN env var must be specified');
        }
        if (inputs.token !== undefined) {
            args.push('--token', inputs.token);
        }
        if (inputs.outputsDir !== undefined) {
            args.push('--outputs-dir', inputs.outputsDir);
        }
        if (inputs.outputs !== undefined) {
            args.push('--outputs', inputs.outputs);
        }
        if (inputs.recordVideo === true) {
            args.push('--record-video');
        }
        if (inputs.devices !== undefined) {
            inputs.devices.forEach(device => {
                args.push('--device', device);
            });
        }
        if (inputs.maxTimeLimit !== undefined) {
            args.push('--max-time-limit', inputs.maxTimeLimit);
        }
        if (inputs.adbEnabled === false) {
            args.push("--no-adb");
        }
        if (inputs.adbBinary !== undefined) {
            args.push('--adb-binary', inputs.adbBinary);
        }
        if (inputs.proxyHost !== undefined) {
            args.push('--proxy-host', inputs.proxyHost);
        }
        if (inputs.proxyPort !== undefined) {
            args.push('--proxy-port', inputs.proxyPort);
        }
        if (inputs.proxyUser !== undefined) {
            args.push('--proxy-user', inputs.proxyUser);
        }
        if (inputs.proxyPass !== undefined) {
            args.push('--proxy-password', inputs.proxyPass);
        }
        if (inputs.dnsServers !== undefined) {
            inputs.dnsServers.forEach(server => {
                args.push('--dns-server', server);
            });
        }
        if (inputs.dnsOverrides !== undefined) {
            inputs.dnsOverrides.forEach(override => {
                args.push('--dns-override', override);
            });
        }
        if (inputs.egressTunnel === true) {
            args.push('--egress-tunnel');
        }
        if (inputs.egressLocalhostFwdIp !== undefined) {
            args.push('--egress-localhost-fwd-ip', inputs.egressLocalhostFwdIp);
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
        const adbPorts = await waitForJson(stdout, inputs.adbEnabled ?? true, inputs.devices?.length ?? 1);
        info("Finished waiting for adb");
        setOutputs(adbPorts);
        saveState("ew_cli_pid", ewCli.pid);
        ewCli.unref();
    }
    catch (e) {
        warning(`ew-cli invoke failed: ${e}`);
        throw e;
    }
}
export async function cleanupInvokeSession() {
    const pid = getState("ew_cli_pid");
    if (pid === undefined || pid.trim().length === 0) {
        info("No ew-cli process to cleanup");
        return;
    }
    const pids = getProcessTree(pid, 0);
    info(`Killing ${pids.length} processes`);
    pids.reverse().forEach((p, index) => {
        const killProcess = spawnSync("kill", ["-2", `${p}`], { encoding: "ascii" });
        info(`kill ${p} returned ${killProcess.status}`);
    });
    let counter = 0;
    while (spawnSync("ps", ["-p", `${pid}`]).status !== 1 && counter < 20) {
        counter += 1;
        await new Promise((resolve, _) => { setTimeout(() => resolve(null), 100); });
    }
    info(`ew-cli cleanup done`);
}
function getProcessTree(pid, currentDepth) {
    let pids = [pid];
    if (currentDepth > 10) {
        return pids;
    }
    const child = spawnSync("pgrep", ["-P", `${pid}`], { encoding: "ascii" });
    if (child.status === 0) {
        child.stdout.split("\n").forEach((p, index) => {
            if (p.trim().length > 0) {
                pids.push(...getProcessTree(p, currentDepth + 1));
            }
        });
    }
    return pids;
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
//# sourceMappingURL=index.js.map