import { info, getState } from '@actions/core';
import { spawnSync } from 'node:child_process';
async function invoke() {
    const pid = getState("ew_cli_pid");
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
invoke();
//# sourceMappingURL=cleanup.js.map