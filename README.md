# emulator.wtf GitHub Actions

[Emulator.wtf](https://emulator.wtf) is an Android cloud emulator laser-focused
on performance to deliver quick feedback to your PRs.

Use these GitHub Actions to run your Android instrumentation tests or make use
of our emulators directly via an ADB connection.

## `emulator-wtf/actions/run-tests`

Run your instrumentation tests with emulator.wtf, optionally with multiple
shards. Build-system agnostic, only APKs are needed.

### Quick usage

A really basic example building an app apk, test apk, running tests and then
finally collecting the results with the `mikepenz/action-junit-report@v6`
action:

```yaml
name: Run tests
on: push
jobs:
  run-tests:
    runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6
    - uses: actions/setup-java@v5
      with:
        distribution: 'zulu'
        java-version: '25'
    - name: Build app
      run: ./gradlew assembleDebug assembleAndroidTest
    - name: Run tests
      uses: emulator-wtf/actions/run-tests@v1.0.0
      with:
        api-token: ${{ secrets.EW_API_TOKEN }}
        app: app/build/outputs/apk/debug/app-debug.apk
        test: app/build/outputs/apk/androidTest/app-debug-androidTest.apk
        outputs-dir: build/test-results
    - name: Publish test report
      uses: mikepenz/action-junit-report@v6
      if: always() # always run even if the tests fail
      with:
        report_paths: 'build/test-results/**/*.xml'
```

See the full list of inputs and additional examples in
[run-tests/README.md](run-tests/README.md).

## `emulator-wtf/actions/use-emulator`

### Quick usage

An example of using `use-emulator` to start three emulators in parallel:

```yaml
name: Test use-emulator
on:
  workflow_dispatch:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v6
    - uses: emulator-wtf/actions/use-emulator@v1.0.0
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

See the full list of inputs and additional examples in
[use-emulator/README.md](use-emulator/README.md).

## `emulator-wtf/actions/configure-credentials`

With this action you can use emulator.wtf in your GitHub Actions workflows
without having to explicitly specify an API token. The action relies on
[GitHub OIDC tokens](https://docs.github.com/en/actions/concepts/security/openid-connect)
to authenticate with emulator.wtf and obtain temporary credentials.

### Quick usage

1. Create a new OIDC configuration in the
   [emulator.wtf web app](https://emulator.wtf).
2. Add `id-token: write` permission to your workflow YAML. You'll most likely
   want the `contents: read` permission too to check out your repository.

   ```yaml
   permissions:
     contents: read
     id-token: write
   ```

3. Invoke the `emulator-wtf/actions/configure-credentials` action with the OIDC
   configuration ID added in step 1.

   ```yaml
   - uses: emulator-wtf/actions/configure-credentials@v1.0.0
     with:
       oidc-configuration-id: **OIDC-CONFIGURATION-ID-GOES-HERE**
   ```

4. Invoke `ew-cli`, emulator.wtf Gradle Plugin or any of the `emulator-wtf/*`
   GitHub actions without having to pass in an API token.

See the full list of inputs and additional examples in
[configure-credentials/README.md](configure-credentials/README.md).

Read more about [OIDC in emulator.wtf](https://docs.emulator.wtf/oidc).
