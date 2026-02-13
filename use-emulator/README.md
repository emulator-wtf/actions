# Use emulator session with emulator.wtf

Emulator.wtf is an Android cloud emulator laser-focused on performance to
deliver quick feedback to your PRs.

With this action you can use emulator.wtf to run emulator sessions without
specifying which tests to run. It will expose adb connection so that
your workflow can run custom logic or tests with the emulator.

## Quick usage

Make sure you have Android SDK installed on your runner.
Add the use-emulator action to you workflow and use adb port from the action outputs
to execute custom logic on the emulator(s)

Basic example:
```yaml
name: Test use-emulator
on:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - uses: emulator-wtf/actions/use-emulator@v1
      id: ew-cli
      with:
        devices: |
          model=Pixel2,version=33,gpu=auto
          model=Pixel2,version=33,gpu=auto
          model=Pixel2,version=33,gpu=auto
    - name: Make use of emulators
      env:
        ADB: ${{ steps.ew-cli.outputs.adb_attached }}
      run: |
        echo "Attached ${{ steps.ew-cli.outputs.adb_attached }}"
        echo "Attached json ${{ steps.ew-cli.outputs.adb_attached_json }}"
        echo "Forwarded ${{ steps.ew-cli.outputs.adb_port_forwarded }}"
        echo "Forwarded json ${{ steps.ew-cli.outputs.adb_port_forwarded_json }}"
        echo "From env: $ADB"
```

## Inputs


| Variable                  | Description                                                                                                                                                                  |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                 | ew-cli version to use (>1.0.1)                                                                                                                                               |
| `api-token`               | API token for emulator.wtf. We recommend using a secret for this.                                                                                                            |
| `devices`                 | Device configurations to use, in the form of `model=X,version=Y` per line                                                                                                    |
| `max-time-limit`          | Timeout for the emulator session, number with unit (`h`, `m` or `s`). Defaults to 1h.                                                                                        |
| `adb`                     | Set to false to skip connecting to device adb port. Defaults to true.                                                                                                        |
| `adb-binary`              | Path to the adb binary to use. If not specified, ew-cli will try to discover it in the `ANDROID_HOME` or `ANDROID_SDK_ROOT` environment variables, or on the `PATH`.         |
| `record-video`            | Set to true to record a video of the emulator session. Defaults to false.                                                                                                    |
| `egress-tunnel`           | Set to true to enable tunneling outgoing internet traffic from the emulator to the action                                                                                    |
| `egress-localhost-fwd-ip` | When using the egress tunnel, make this action's localhost available to the emulator under the specified IP address (should NOT be a public IP, loopback IP or broadcast IP) |
| `dns-server`              | DNS server(s) to use for the emulator, one per line. Can specify up to 4 servers. If not specified, the emulator will use default DNS servers.                               |
| `dns-override`            | Hard-code specific hostname-ip combinations, one per line in the form of hostname=ip (e.g. example.com=10.0.0.1)                                                             |
| `outputs`                 | Comma-separated list to specify what to download to output-dir.                                                                                                              |
| `outputs-dir`             | Location to store emulator session outputs in                                                                                                                                |
| `proxy-host`              | Configure a proxy host to use for all requests when making emulator.wtf API calls.                                                                                           |
| `proxy-port`              | Configure a proxy port to use for all requests when making emulator.wtf API calls.                                                                                           |
| `proxy-user`              | Set the proxy user to use for authentication.                                                                                                                                |
| `proxy-password`          | Set the proxy password to use for authentication.                                                                                                                            |

## Outputs

use-emulator registers outputs, which can be used to get the port number for adb devices.
Outputs are either in comma-separated lists or in JSON format:
```json
[{"type":"adb_attached","model":"Pixel2","version":33,"ip":"127.0.0.1","port":41137},{"type":"adb_attached","model":"Pixel7","version":34,"ip":"127.0.0.1","port":51137}]
```

| Variable                  | Description                                                                                                  |
|---------------------------|--------------------------------------------------------------------------------------------------------------|
| `adb_attached`            | Comma-separated list of adb attached ports, e.g. `23433,61323`. Not filled when 'adb: false' option is used. |
| `adb_attached_json`       | List of adb attached ports in JSON format. Not filled when 'adb: false' option is used.                      |
| `adb_port_forwarded`      | Comma-separated list of forwarded adb ports, e.g. `23433,61323`. Useful when 'adb: false' option is used.    |
| `adb_port_forwarded_json` | List of forwarded adb ports in JSON format. Useful when 'adb: false' option is used.                         |
