import { getOptionalBooleanInput, getOptionalMultilineInput, getOptionalStringInput, } from "../lib/utils.js";
import { getCliNetworkInputs, getEmulatorConfigInputs, } from "../lib/shared-inputs.js";
export function getInvokeInputs() {
    const cliNetworkInputs = getCliNetworkInputs();
    const emulatorConfigInputs = getEmulatorConfigInputs();
    return {
        token: getOptionalStringInput("api-token"),
        appApk: getOptionalStringInput("app"),
        testApk: getOptionalStringInput("test"),
        libraryTestApk: getOptionalStringInput("library-test"),
        outputsDir: getOptionalStringInput("outputs-dir"),
        outputs: getOptionalStringInput("outputs"),
        recordVideo: getOptionalBooleanInput("record-video"),
        timeout: getOptionalStringInput("timeout"),
        useOrchestrator: getOptionalBooleanInput("use-orchestrator"),
        testRunnerClass: getOptionalStringInput("test-runner-class"),
        clearPackageData: getOptionalBooleanInput("clear-package-data"),
        withCoverage: getOptionalBooleanInput("with-coverage"),
        testTargets: getOptionalMultilineInput("test-targets"),
        additionalApks: getOptionalMultilineInput("additional-apks"),
        environmentVariables: getOptionalMultilineInput("environment-variables"),
        secretEnvironmentVariables: getOptionalMultilineInput("secret-environment-variables"),
        shardTargetRuntime: getOptionalStringInput("shard-target-runtime"),
        testcaseDurationHint: getOptionalStringInput("testcase-duration-hint"),
        numUniformShards: getOptionalStringInput("num-uniform-shards"),
        numShards: getOptionalStringInput("num-shards"),
        numBalancedShards: getOptionalStringInput("num-balanced-shards"),
        dirsToPull: getOptionalMultilineInput("directories-to-pull"),
        sideEffects: getOptionalBooleanInput("side-effects"),
        numFlakyTestAttempts: getOptionalStringInput("num-flaky-test-attempts"),
        flakyTestRepeatMode: getOptionalStringInput("flaky-test-repeat-mode"),
        fileCache: getOptionalBooleanInput("file-cache"),
        fileCacheTtl: getOptionalStringInput("file-cache-ttl"),
        testCache: getOptionalBooleanInput("test-cache"),
        async: getOptionalBooleanInput("async"),
        displayName: getOptionalStringInput("display-name"),
        ...cliNetworkInputs,
        ...emulatorConfigInputs,
    };
}
