import { getBooleanInput, getInput, getMultilineInput, setFailed, warning } from '@actions/core';
import { exec } from '@actions/exec';

async function invoke() {
  try {
    const token = getInput('api-token');
    const appApk = getInput('app');
    const testApk = getInput('test');
    const libraryTestApk = getInput('library-test');
    const outputsDir = getInput('outputs-dir');
    const outputs = getInput('outputs');
    const recordVideo = getInput('record-video');

    const devices = getMultilineInput('devices').filter(x => x.length > 0);
    const timeout = getInput('timeout')
    const useOrchestrator = getInput('use-orchestrator') && getBooleanInput('use-orchestrator');
    const testRunnerClass = getInput('test-runner-class');
    const clearPackageData = getInput('clear-package-data') && getBooleanInput('clear-package-data');
    const withCoverage = getInput('with-coverage') && getBooleanInput('with-coverage');
    const testTargets = getMultilineInput('test-targets').map(x => x.trim()).filter(x => x.length > 0);

    const additionalApks = getMultilineInput('additional-apks').filter(x => x.length > 0);
    const environmentVariables = getMultilineInput('environment-variables').filter(x => x.length > 0);
    const secretEnvironmentVariables = getMultilineInput('secret-environment-variables').filter(x => x.length > 0);

    const shardTargetRuntime = getInput("shard-target-runtime");
    const testcaseDurationHint = getInput("testcase-duration-hint");
    const numUniformShards = getInput('num-uniform-shards');
    const numShards = getInput('num-shards');
    const numBalancedShards = getInput('num-balanced-shards');

    const dirsToPull = getMultilineInput('directories-to-pull').filter(x => x.length > 0);

    const sideEffects = getInput('side-effects') && getBooleanInput('side-effects');
    const numFlakyTestAttempts = getInput('num-flaky-test-attempts');
    const flakyTestRepeatMode = getInput('flaky-test-repeat-mode');

    const fileCache = getInput('file-cache') ? getBooleanInput('file-cache') : true;
    const fileCacheTtl = getInput('file-cache-ttl');
    const testCache = getInput('test-cache') ? getBooleanInput('test-cache') : true;

    const async = getInput('async') && getBooleanInput('async');

    const displayName = getInput('display-name');

    const proxyHost = getInput('proxy-host');
    const proxyPort = getInput('proxy-port');
    const proxyUser = getInput('proxy-user');
    const proxyPass = getInput('proxy-password');

    const dnsServers = getMultilineInput('dns-server').filter(x => x.length > 0);
    const dnsOverrides = getMultilineInput('dns-override').filter(x => x.length > 0);
    const egressTunnel = getInput('egress-tunnel') && getBooleanInput('egress-tunnel');
    const egressLocalhostFwdIp = getInput('egress-localhost-fwd-ip');

    const args = [];

    if (token === '' && process.env['EW_API_TOKEN'] === undefined) {
      warning('api-token or EW_API_TOKEN env var must be specified');
      setFailed('api-token or EW_API_TOKEN env var must be specified');
      return;
    }

    if (token !== '') {
      args.push('--token', token);
    }

    if (libraryTestApk) {
      if (appApk || testApk) {
        warning('library-test should be used without app and test');
        setFailed('library-test should be used without app and test');
        return;
      }
      args.push('--library-test', libraryTestApk);
    } else if (!appApk) {
      warning('app must be specified');
      setFailed('app must be specified');
      return;
    } else if (!testApk) {
      warning('test must be specified');
      setFailed('test must be specified');
      return;
    } else {
      args.push('--app', appApk, '--test', testApk);
    }

    if (outputsDir) {
      args.push('--outputs-dir', outputsDir);
    }

    if (outputs) {
      args.push('--outputs', outputs);
    }

    if (recordVideo !== '') {
      if (getBooleanInput(recordVideo)) {
        args.push('--record-video');
      } else {
        args.push('--no-record-video');
      }
    }

    if (devices) {
      devices.forEach(device => {
        args.push('--device', device);
      });
    }

    if (timeout) {
      args.push('--timeout', timeout);
    }

    if (testTargets) {
      args.push('--test-targets', testTargets.join(';'));
    }

    if (displayName) {
      args.push('--display-name', displayName);
    }

    if (useOrchestrator) {
      args.push('--use-orchestrator');
    }

    if (testRunnerClass) {
      args.push('--test-runner-class', testRunnerClass);
    }

    if (clearPackageData) {
      args.push('--clear-package-data');
    }

    if (withCoverage) {
      args.push('--with-coverage');
    }

    if (additionalApks.length > 0) {
      args.push('--additional-apks', additionalApks.join(','));
    }

    if (environmentVariables.length > 0) {
      args.push('--environment-variables', environmentVariables.join(','));
    }

    if (secretEnvironmentVariables.length > 0) {
      args.push('--secret-environment-variables', secretEnvironmentVariables.join(','));
    }

    if (shardTargetRuntime) {
      args.push('--shard-target-runtime', shardTargetRuntime);
    } else if (numBalancedShards) {
      args.push('--num-balanced-shards', numBalancedShards);
    } else if (numShards) {
      args.push('--num-shards', numShards);
    } else if (numUniformShards) {
      args.push('--num-uniform-shards', numUniformShards);
    }

    if (testcaseDurationHint) {
      args.push('--testcase-duration-hint', testcaseDurationHint);
    }

    if (dirsToPull.length > 0) {
      args.push('--directories-to-pull', dirsToPull.join(','));
    }

    if (sideEffects) {
      args.push('--side-effects');
    }

    if (numFlakyTestAttempts) {
      args.push('--num-flaky-test-attempts', numFlakyTestAttempts);
    }

    if (flakyTestRepeatMode) {
      args.push('--flaky-test-repeat-mode', flakyTestRepeatMode);
    }

    if (!fileCache) {
      args.push('--no-file-cache');
    }

    if (fileCacheTtl) {
      args.push('--file-cache-ttl', fileCacheTtl);
    }

    if (!testCache) {
      args.push('--no-test-cache');
    }

    if (async) {
      args.push('--async');
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

    args.push('--ew-integration', 'github-action 0.9.5');

    await exec('ew-cli', args);
  } catch (e) {
    warning(`ew-cli invoke failed: ${e}`);
    setFailed(e);
  }
}

invoke();
