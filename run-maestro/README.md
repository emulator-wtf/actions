# `emulator-wtf/actions/run-maestro`

Emulator.wtf is an Android cloud emulator laser-focused on performance to
deliver quick feedback to your PRs.

With this action you can easily run your [Maestro](https://maestro.dev) flows
with [emulator.wtf](https://emulator.wtf).

## Quick example

A really basic example building an app apk, running the Maestro flows in the
`.maestro` directory against it and then finally collecting the results with the
`mikepenz/action-junit-report@v6` action:

```yaml
name: Run Maestro flows
on: push
jobs:
  run-maestro:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-java@v5
        with:
          distribution: 'zulu'
          java-version: '25'
      - name: Build app
        run: ./gradlew assembleDebug
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          outputs-dir: build/test-results
      - name: Publish test report
        uses: mikepenz/action-junit-report@v6
        if: always() # always run even if the flows fail
        with:
          report_paths: 'build/test-results/**/*.xml'
```

The whole `workspace` directory is uploaded and the flows to run are picked at
run time from the workspace's `config.yaml` and tags, exactly like a local
`maestro test <workspace>` run.

## Inputs

| Variable                       | Description                                                                                                                                                                  |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                      | ew-cli version to use                                                                                                                                                        |
| `api-token`                    | API token for emulator.wtf. We recommend using a secret for this.                                                                                                            |
| `workspace`                    | Path to the directory holding your Maestro flows (the Maestro workspace). Required.                                                                                          |
| `config`                       | Workspace config file to use instead of the workspace's own root `config.yaml`                                                                                               |
| `flows`                        | Flows to run, one per line, in the same format as the workspace config's `flows:` entries (e.g. `login.yaml` or `smoke/*.yaml`). Defaults to the flows in `config.yaml`.     |
| `include-tags`                 | Only run flows carrying at least one of these tags, one tag per line                                                                                                         |
| `exclude-tags`                 | Skip flows carrying any of these tags, one tag per line                                                                                                                      |
| `app`                          | Path to the application apk file your flows drive. Required.                                                                                                                 |
| `additional-apks`              | Additional apks to install, one per line                                                                                                                                     |
| `file-cache-ttl`               | How long to cache uploaded files for, up to 7d. Defaults to 1h.                                                                                                              |
| `file-cache`                   | Whether to cache files between runs. Defaults to true.                                                                                                                       |
| `display-name`                 | Display name for the test run                                                                                                                                                |
| `devices`                      | Device configurations to use, in the form of `model=X,version=Y` per line                                                                                                    |
| `timeout`                      | Timeout for the test run, number with unit (`h`, `m` or `s`). Defaults to 15m.                                                                                               |
| `environment-variables`        | Environment variables to pass to Maestro, one per line in the form of `key=value`. Flows can read them as `${KEY}`.                                                          |
| `secret-environment-variables` | Secret environment variables to pass to Maestro, one per line in the form of `key=value`. Kept out of logs and the results UI.                                               |
| `test-cache`                   | Whether to cache flow results between runs. Defaults to true.                                                                                                                |
| `side-effects`                 | Whether the flows have any side effects, like hitting external APIs. Prevents any test caching and retries.                                                                  |
| `num-flaky-test-attempts`      | Number of times to retry shards with failed flows, up to 10. Defaults to 0.                                                                                                  |
| `flaky-test-repeat-mode`       | Whether to repeat only failed flows (`failed_only`) or full shards (`all`) with flaky test attempts. Defaults to `failed_only`.                                               |
| `num-balanced-shards`          | Set to a number larger than 1 to split your flows into multiple shards based on flow execution time to be executed in parallel                                               |
| `shard-target-runtime`         | Target a specific runtime (in minutes), this will spawn as many shards as needed to hit the target runtime.                                                                  |
| `testcase-duration-hint`       | Hint the average runtime for each flow with a duration (e.g. 10s or 150ms). Defaults to 10s. Used when historical runtime data is missing.                                   |
| `num-shards`                   | Set to a number larger than 1 to split your flows into multiple shards based on flow counts to be executed in parallel                                                       |
| `flows-for-shard`              | Specify shards manually, one shard per line. Each line is a comma-separated list of flows in the same format as `flows`.                                                     |
| `record-video`                 | Whether to record a video of the test run. Defaults to true.                                                                                                                 |
| `directories-to-pull`          | Directories to pull from device and store in `outputs-dir`, one per line                                                                                                     |
| `outputs`                      | Comma-separated list to specify what to download to output-dir. Defaults to `merged_results_xml,coverage,pulled_dirs`.                                                       |
| `outputs-dir`                  | Location to store test outputs in                                                                                                                                            |
| `dns-server`                   | DNS server(s) to use for the emulator, one per line. Can specify up to 4 servers. If not specified, the emulator will use default DNS servers.                               |
| `dns-override`                 | Hard-code specific hostname-ip combinations, one per line in the form of hostname=ip (e.g. example.com=10.0.0.1)                                                             |
| `egress-tunnel`                | Set to true to enable tunneling outgoing internet traffic from the emulator to the action                                                                                    |
| `egress-localhost-fwd-ip`      | When using the egress tunnel, make this action's localhost available to the emulator under the specified IP address (should NOT be a public IP, loopback IP or broadcast IP) |
| `proxy-host`                   | Configure a proxy host to use for all requests when making emulator.wtf API calls.                                                                                           |
| `proxy-port`                   | Configure a proxy port to use for all requests when making emulator.wtf API calls.                                                                                           |
| `proxy-user`                   | Set the proxy user to use for authentication.                                                                                                                                |
| `proxy-password`               | Set the proxy password to use for authentication.                                                                                                                            |
| `async`                        | Run the flows asynchronously, without waiting for the results. Useful if you're using the GitHub integration with check statuses.                                            |

The sharding inputs `num-balanced-shards`, `shard-target-runtime`, `num-shards`
and `flows-for-shard` are mutually exclusive, use at most one of them.

## Common examples

### Run flows on multiple device profiles

If you want to run on a different Android version or device profile you can use
the `devices` input to do so. Every device configuration runs the flows in
parallel:

```yaml
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          devices: |
            model=Pixel7,version=30
            model=Pixel7,version=34
```

### Run only some flows

Pick flows by path with `flows`, or by Maestro tags with `include-tags` and
`exclude-tags`:

```yaml
      - name: Run Maestro smoke flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          include-tags: smoke
          exclude-tags: |
            wip
            slow
```

### Pass variables and secrets to flows

Flows read the passed variables as `${KEY}`. Use `secret-environment-variables`
for anything sensitive, those are kept out of logs and the results UI:

```yaml
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          environment-variables: |
            API_URL=https://staging.example.com
          secret-environment-variables: |
            TEST_USER_PASSWORD=${{ secrets.TEST_USER_PASSWORD }}
```

### Run flows with shards

The following example splits the flows into 3 shards running in parallel and
stores the outputs in `build/test-results`:

```yaml
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          num-shards: 3
          outputs-dir: build/test-results
```

To control the shards yourself, list the flows of each shard on its own line
with `flows-for-shard`. This runs two shards, one with the `smoke` directory and
one with the rest of the flows:

```yaml
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          flows-for-shard: |
            smoke/*.yaml
            login.yaml,checkout/*.yaml
```

### Retry flaky flows

Re-run failed flows up to 2 more times. Repeat attempts run in parallel:

```yaml
      - name: Run Maestro flows
        uses: emulator-wtf/actions/run-maestro@v1.2.6
        with:
          api-token: ${{ secrets.EW_API_TOKEN }}
          workspace: .maestro
          app: app/build/outputs/apk/debug/app-debug.apk
          num-flaky-test-attempts: 2
```
