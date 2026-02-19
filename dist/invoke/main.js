import { setFailed, warning } from '@actions/core';
import { exec } from '@actions/exec';
import { getInvokeInputs } from './inputs.js';
import { appendCliNetworkInputsToArgs, appendEmulatorConfigInputsToArgs } from '../lib/shared-inputs.js';
import { extractErrorMessage } from '../lib/utils.js';
import { INTEGRATION_VERSION } from '../version.js';
async function invoke(inputs) {
    try {
        const args = [];
        if (inputs.token === undefined && process.env['EW_API_TOKEN'] === undefined) {
            warning('api-token or EW_API_TOKEN env var must be specified');
            setFailed('api-token or EW_API_TOKEN env var must be specified');
            return;
        }
        if (inputs.token !== undefined) {
            args.push('--token', inputs.token);
        }
        if (inputs.libraryTestApk) {
            if (inputs.appApk || inputs.testApk) {
                warning('library-test should be used without app and test');
                setFailed('library-test should be used without app and test');
                return;
            }
            args.push('--library-test', inputs.libraryTestApk);
        }
        else if (!inputs.appApk) {
            warning('app must be specified');
            setFailed('app must be specified');
            return;
        }
        else if (!inputs.testApk) {
            warning('test must be specified');
            setFailed('test must be specified');
            return;
        }
        else {
            args.push('--app', inputs.appApk, '--test', inputs.testApk);
        }
        if (inputs.outputsDir) {
            args.push('--outputs-dir', inputs.outputsDir);
        }
        if (inputs.outputs) {
            args.push('--outputs', inputs.outputs);
        }
        if (inputs.recordVideo !== false) {
            args.push('--no-record-video');
        }
        else {
            args.push('--record-video');
        }
        if (inputs.timeout) {
            args.push('--timeout', inputs.timeout);
        }
        if (inputs.testTargets) {
            args.push('--test-targets', inputs.testTargets.join(';'));
        }
        if (inputs.displayName) {
            args.push('--display-name', inputs.displayName);
        }
        if (inputs.useOrchestrator) {
            args.push('--use-orchestrator');
        }
        if (inputs.testRunnerClass) {
            args.push('--test-runner-class', inputs.testRunnerClass);
        }
        if (inputs.clearPackageData) {
            args.push('--clear-package-data');
        }
        if (inputs.withCoverage) {
            args.push('--with-coverage');
        }
        if (inputs.additionalApks !== undefined) {
            args.push('--additional-apks', inputs.additionalApks.join(','));
        }
        if (inputs.environmentVariables !== undefined) {
            args.push('--environment-variables', inputs.environmentVariables.join(','));
        }
        if (inputs.secretEnvironmentVariables !== undefined) {
            args.push('--secret-environment-variables', inputs.secretEnvironmentVariables.join(','));
        }
        if (inputs.shardTargetRuntime) {
            args.push('--shard-target-runtime', inputs.shardTargetRuntime);
        }
        else if (inputs.numBalancedShards) {
            args.push('--num-balanced-shards', inputs.numBalancedShards);
        }
        else if (inputs.numShards) {
            args.push('--num-shards', inputs.numShards);
        }
        else if (inputs.numUniformShards) {
            args.push('--num-uniform-shards', inputs.numUniformShards);
        }
        if (inputs.testcaseDurationHint) {
            args.push('--testcase-duration-hint', inputs.testcaseDurationHint);
        }
        if (inputs.dirsToPull !== undefined) {
            args.push('--directories-to-pull', inputs.dirsToPull.join(','));
        }
        if (inputs.sideEffects) {
            args.push('--side-effects');
        }
        if (inputs.numFlakyTestAttempts) {
            args.push('--num-flaky-test-attempts', inputs.numFlakyTestAttempts);
        }
        if (inputs.flakyTestRepeatMode) {
            args.push('--flaky-test-repeat-mode', inputs.flakyTestRepeatMode);
        }
        if (inputs.fileCache === false) {
            args.push('--no-file-cache');
        }
        if (inputs.fileCacheTtl) {
            args.push('--file-cache-ttl', inputs.fileCacheTtl);
        }
        if (inputs.testCache === false) {
            args.push('--no-test-cache');
        }
        if (inputs.async) {
            args.push('--async');
        }
        appendCliNetworkInputsToArgs(inputs, args);
        appendEmulatorConfigInputsToArgs(inputs, args);
        args.push('--ew-integration', `github-actions ${INTEGRATION_VERSION}`);
        await exec('ew-cli', args);
    }
    catch (e) {
        warning(`ew-cli invoke failed: ${e}`);
        setFailed(e);
    }
}
try {
    await invoke(getInvokeInputs());
}
catch (e) {
    const msg = extractErrorMessage(e);
    warning(`invoke failed: ${msg}`);
    setFailed(msg);
}
//# sourceMappingURL=main.js.map