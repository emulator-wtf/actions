import { getState, info, saveState, setOutput, warning } from "@actions/core";
import { spawn, spawnSync } from "node:child_process";
import type { Readable } from "node:stream";
import type { InvokeSessionInputs } from "./inputs.js";
import {
  appendCliNetworkInputsToArgs,
  appendEmulatorConfigInputsToArgs,
} from "../lib/shared-inputs.js";
import { extractErrorMessage } from "../lib/utils.js";

const WAIT_TIMEOUT = 60000;

export async function invokeSession(
  inputs: InvokeSessionInputs,
): Promise<void> {
  const args = ["start-session", "--json"];

  if (inputs.token === undefined && process.env.EW_API_TOKEN === undefined) {
    throw new Error("api-token or EW_API_TOKEN env var must be specified");
  }

  if (inputs.token !== undefined) {
    args.push("--token", inputs.token);
  }

  if (inputs.outputsDir !== undefined) {
    args.push("--outputs-dir", inputs.outputsDir);
  }

  if (inputs.outputs !== undefined) {
    args.push("--outputs", inputs.outputs);
  }

  if (inputs.recordVideo === true) {
    args.push("--record-video");
  }

  if (inputs.maxTimeLimit !== undefined) {
    args.push("--max-time-limit", inputs.maxTimeLimit);
  }

  if (inputs.adbEnabled === false) {
    args.push("--no-adb");
  }

  if (inputs.adbBinary !== undefined) {
    args.push("--adb-binary", inputs.adbBinary);
  }

  appendCliNetworkInputsToArgs(inputs, args);
  appendEmulatorConfigInputsToArgs(inputs, args);

  info(`Starting ew-cli`);

  const ewCli = spawn("ew-cli", args);

  const { stdout } = ewCli;
  const { stderr } = ewCli;

  stdout.on("data", (data) => {
    info(`${data}`);
  });
  stderr.on("data", (data) => {
    info(`${data}`);
  });

  const adbPorts = await waitForJson(
    stdout,
    inputs.adbEnabled ?? true,
    inputs.devices?.length ?? 1,
  );

  if (adbPorts === null) {
    //TODO(madis) fail instead?
    warning(
      "Did not receive adb port information within timeout, setting outputs to empty",
    );
  } else {
    info("Finished waiting for adb");
    setOutputs(adbPorts);
    saveState("ew_cli_pid", ewCli.pid);
  }

  ewCli.unref();
}

export async function cleanupInvokeSession(): Promise<void> {
  const pid = getState("ew_cli_pid");
  if (pid.trim().length === 0) {
    info("No ew-cli process to cleanup");
    return;
  }

  const pids = getProcessTree(pid, 0);
  info(`Killing ${pids.length} processes`);
  // reverse pids so that child processes get the signal first
  pids.reverse().forEach((p, _) => {
    const killProcess = spawnSync("kill", ["-2", p], { encoding: "ascii" });
    info(`kill ${p} returned ${killProcess.status}`);
  });

  await waitForProcessExit(pid);

  info(`ew-cli cleanup done`);
}

async function waitForProcessExit(
  pid: string,
  totalAttempts = 20,
  attempt = 0,
  delayMs = 100,
): Promise<void> {
  // check if process is still alive
  const result = spawnSync("ps", ["-p", pid], { encoding: "ascii" });
  if (result.status === 1) {
    return;
  }

  if (attempt >= totalAttempts) {
    warning(`Process ${pid} did not exit after ${totalAttempts * delayMs} ms`);
    return;
  }

  await sleep(delayMs);

  await waitForProcessExit(pid, totalAttempts, attempt + 1, delayMs);
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function sleep(ms: number): Promise<void> {
  // eslint-disable-next-line promise/avoid-new,@typescript-eslint/strict-void-return,no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getProcessTree(pid: string, currentDepth: number): string[] {
  const pids = [pid];
  if (currentDepth > 10) {
    return pids;
  }
  const child = spawnSync("pgrep", ["-P", pid], { encoding: "ascii" });
  if (child.status === 0) {
    child.stdout.split("\n").forEach((p, index) => {
      if (p.trim().length > 0) {
        pids.push(...getProcessTree(p, currentDepth + 1));
      }
    });
  }
  return pids;
}

function setOutputs(adbPorts: AdbPortOutputs): void {
  setOutput(
    "adb_attached",
    adbPorts.attachedEvents.map((v) => v.port).join(","),
  );
  setOutput("adb_attached_json", JSON.stringify(adbPorts.attachedEvents));
  setOutput(
    "adb_port_forwarded",
    adbPorts.forwardedEvents.map((v) => v.port).join(","),
  );
  setOutput(
    "adb_port_forwarded_json",
    JSON.stringify(adbPorts.forwardedEvents),
  );
}

async function waitForJson(
  stdout: Readable,
  adbEnabled: boolean,
  numberOfDevices: number,
): Promise<AdbPortOutputs | null> {
  // eslint-disable-next-line promise/avoid-new
  return await new Promise((resolve) => {
    const attachedEvents: EwCliOutput[] = [];
    const forwardedEvents: EwCliOutput[] = [];
    stdout.on("data", (data) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion,@typescript-eslint/no-unsafe-argument
        const ewCliEvent: EwCliOutput = JSON.parse(data) as EwCliOutput;
        switch (ewCliEvent.type) {
          case "adb_attached":
            attachedEvents.push(ewCliEvent);
            break;
          case "adb_port_forwarded":
            forwardedEvents.push(ewCliEvent);
            break;
        }
        const size = adbEnabled
          ? attachedEvents.length
          : forwardedEvents.length;
        if (size >= numberOfDevices) {
          resolve({ attachedEvents, forwardedEvents });
        }
      } catch (e) {
        const msg = extractErrorMessage(e);
        warning(msg);
      }
    });
    // TODO(madis) reject instead of resolve with null?
    setTimeout(() => {
      resolve(null);
    }, WAIT_TIMEOUT);
  });
}

interface AdbPortOutputs {
  attachedEvents: EwCliOutput[];
  forwardedEvents: EwCliOutput[];
}

interface EwCliOutput {
  type: string;
  model?: string;
  version?: number;
  ip?: string;
  port?: number;
  message?: string;
}
