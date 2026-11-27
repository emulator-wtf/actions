import { exec } from "@actions/exec";
import type { InvokeMaestroInputs } from "./inputs.js";
import {
  appendCliNetworkInputsToArgs,
  appendEmulatorConfigInputsToArgs,
} from "../lib/shared-inputs.js";
import { INTEGRATION_VERSION } from "../version.js";

export default async function invokeMaestro(
  inputs: InvokeMaestroInputs,
): Promise<void> {
  const args: string[] = ["maestro", "run"];

  if (inputs.token === undefined && process.env.EW_API_TOKEN === undefined) {
    throw new Error("api-token or EW_API_TOKEN env var must be specified");
  }

  if (inputs.token !== undefined) {
    args.push("--token", inputs.token);
  }

  if (inputs.workspace === undefined) {
    throw new Error("workspace must be specified");
  }
  if (inputs.appApk === undefined) {
    throw new Error("app must be specified");
  }
  args.push("--workspace", inputs.workspace, "--app", inputs.appApk);

  if (inputs.config !== undefined) {
    args.push("--config", inputs.config);
  }

  if (inputs.flows !== undefined) {
    args.push("--flows", inputs.flows.join(","));
  }

  if (inputs.includeTags !== undefined) {
    args.push("--include-tags", inputs.includeTags.join(","));
  }

  if (inputs.excludeTags !== undefined) {
    args.push("--exclude-tags", inputs.excludeTags.join(","));
  }

  if (inputs.additionalApks !== undefined) {
    args.push("--additional-apks", inputs.additionalApks.join(","));
  }

  if (inputs.fileCache === false) {
    args.push("--no-file-cache");
  }

  if (inputs.fileCacheTtl !== undefined) {
    args.push("--file-cache-ttl", inputs.fileCacheTtl);
  }

  if (inputs.displayName !== undefined) {
    args.push("--display-name", inputs.displayName);
  }

  if (inputs.timeout !== undefined) {
    args.push("--timeout", inputs.timeout);
  }

  if (inputs.environmentVariables !== undefined) {
    args.push("--environment-variables", inputs.environmentVariables.join(","));
  }

  if (inputs.secretEnvironmentVariables !== undefined) {
    args.push(
      "--secret-environment-variables",
      inputs.secretEnvironmentVariables.join(","),
    );
  }

  if (inputs.testCache === false) {
    args.push("--no-test-cache");
  }

  if (inputs.sideEffects === true) {
    args.push("--side-effects");
  }

  if (inputs.numFlakyTestAttempts !== undefined) {
    args.push("--num-flaky-test-attempts", inputs.numFlakyTestAttempts);
  }

  if (inputs.flakyTestRepeatMode !== undefined) {
    args.push("--flaky-test-repeat-mode", inputs.flakyTestRepeatMode);
  }

  // sharding options are mutually exclusive, pass them all through and let
  // ew-cli report a conflict instead of silently picking one
  if (inputs.numBalancedShards !== undefined) {
    args.push("--num-balanced-shards", inputs.numBalancedShards);
  }

  if (inputs.shardTargetRuntime !== undefined) {
    args.push("--shard-target-runtime", inputs.shardTargetRuntime);
  }

  if (inputs.numShards !== undefined) {
    args.push("--num-shards", inputs.numShards);
  }

  if (inputs.flowsForShard !== undefined) {
    inputs.flowsForShard.forEach((shard) => {
      args.push("--flows-for-shard", shard);
    });
  }

  if (inputs.testcaseDurationHint !== undefined) {
    args.push("--testcase-duration-hint", inputs.testcaseDurationHint);
  }

  if (inputs.recordVideo === undefined || inputs.recordVideo) {
    args.push("--record-video");
  } else {
    args.push("--no-record-video");
  }

  if (inputs.dirsToPull !== undefined) {
    args.push("--directories-to-pull", inputs.dirsToPull.join(","));
  }

  if (inputs.outputs !== undefined) {
    args.push("--outputs", inputs.outputs);
  }

  if (inputs.outputsDir !== undefined) {
    args.push("--outputs-dir", inputs.outputsDir);
  }

  if (inputs.async === true) {
    args.push("--async");
  }

  appendCliNetworkInputsToArgs(inputs, args);
  appendEmulatorConfigInputsToArgs(inputs, args);

  args.push("--ew-integration", `github-actions ${INTEGRATION_VERSION}`);

  await exec("ew-cli", args);
}
