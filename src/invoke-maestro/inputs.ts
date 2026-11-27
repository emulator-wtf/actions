import {
  getOptionalBooleanInput,
  getOptionalMultilineInput,
  getOptionalStringInput,
} from "../lib/utils.js";
import {
  type CliNetworkInputs,
  type EmulatorConfigInputs,
  getCliNetworkInputs,
  getEmulatorConfigInputs,
} from "../lib/shared-inputs.js";

export interface InvokeMaestroInputs
  extends CliNetworkInputs, EmulatorConfigInputs {
  token?: string;

  workspace?: string;
  config?: string;
  flows?: string[];
  includeTags?: string[];
  excludeTags?: string[];
  appApk?: string;
  additionalApks?: string[];

  fileCache?: boolean;
  fileCacheTtl?: string;

  displayName?: string;
  timeout?: string;
  environmentVariables?: string[];
  secretEnvironmentVariables?: string[];
  testCache?: boolean;
  sideEffects?: boolean;
  numFlakyTestAttempts?: string;
  flakyTestRepeatMode?: string;

  numBalancedShards?: string;
  shardTargetRuntime?: string;
  testcaseDurationHint?: string;
  numShards?: string;
  flowsForShard?: string[];

  recordVideo?: boolean;
  dirsToPull?: string[];
  outputs?: string;
  outputsDir?: string;

  async?: boolean;
}

export function getInvokeMaestroInputs(): InvokeMaestroInputs {
  const cliNetworkInputs = getCliNetworkInputs();
  const emulatorConfigInputs = getEmulatorConfigInputs();

  return {
    token: getOptionalStringInput("api-token"),

    workspace: getOptionalStringInput("workspace"),
    config: getOptionalStringInput("config"),
    flows: getOptionalMultilineInput("flows"),
    includeTags: getOptionalMultilineInput("include-tags"),
    excludeTags: getOptionalMultilineInput("exclude-tags"),
    appApk: getOptionalStringInput("app"),
    additionalApks: getOptionalMultilineInput("additional-apks"),

    fileCache: getOptionalBooleanInput("file-cache"),
    fileCacheTtl: getOptionalStringInput("file-cache-ttl"),

    displayName: getOptionalStringInput("display-name"),
    timeout: getOptionalStringInput("timeout"),
    environmentVariables: getOptionalMultilineInput("environment-variables"),
    secretEnvironmentVariables: getOptionalMultilineInput(
      "secret-environment-variables",
    ),
    testCache: getOptionalBooleanInput("test-cache"),
    sideEffects: getOptionalBooleanInput("side-effects"),
    numFlakyTestAttempts: getOptionalStringInput("num-flaky-test-attempts"),
    flakyTestRepeatMode: getOptionalStringInput("flaky-test-repeat-mode"),

    numBalancedShards: getOptionalStringInput("num-balanced-shards"),
    shardTargetRuntime: getOptionalStringInput("shard-target-runtime"),
    testcaseDurationHint: getOptionalStringInput("testcase-duration-hint"),
    numShards: getOptionalStringInput("num-shards"),
    flowsForShard: getOptionalMultilineInput("flows-for-shard"),

    recordVideo: getOptionalBooleanInput("record-video"),
    dirsToPull: getOptionalMultilineInput("directories-to-pull"),
    outputs: getOptionalStringInput("outputs"),
    outputsDir: getOptionalStringInput("outputs-dir"),

    async: getOptionalBooleanInput("async"),

    ...cliNetworkInputs,
    ...emulatorConfigInputs,
  };
}
