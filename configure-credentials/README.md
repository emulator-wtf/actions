# Configure emulator.wtf credentials

Emulator.wtf is an Android cloud emulator laser-focused on performance to
deliver quick feedback to your PRs.

With this action you can use emulator.wtf in your GitHub Actions workflows
without having to explicitly specify an API token. The action relies on
[GitHub OIDC tokens](https://docs.github.com/en/actions/concepts/security/openid-connect)
to authenticate with emulator.wtf and obtain temporary credentials.

## Quick usage

1. Create a new OIDC configuration in the
   [emulator.wtf web app](https://emulator.wtf).
2. Add `id-token: write` permission to your workflow YAML. You'll most likely
   want the `contents: read` permission too to check out your repository.
   
   ```yaml
   permissions:
     contents: read
     id-token: write
   ```

3. Invoke the `emulator-wtf/configure-credentials` action with the OIDC
   configuration ID added in step 1.

   ```yaml
   - uses: emulator-wtf/configure-credentials@v1
     with:
       oidc-configuration-id: **OIDC-CONFIGURATION-ID-GOES-HERE**
   ```

4. Invoke `ew-cli`, emulator.wtf Gradle Plugin or any of the `emulator-wtf/*`
   GitHub actions without having to pass in an API token.

Read more about [OIDC in emulator.wtf](https://docs.emulator.wtf/oidc).

## Inputs

| Variable                | Description                                                       |
|-------------------------|-------------------------------------------------------------------|
| `oidc-configuration-id` | The OIDC configuration ID as displayed in the emulator.wtf webapp |

## Full example of a GitHub workflow using this action

```yaml
name: Test workflow
permissions:
  contents: read
  id-token: write
on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-java@v5
      with:
        distribution: 'zulu'
        java-version: '24'
    - uses: emulator-wtf/configure-credentials@v1
      with:
        oidc-configuration-id: **OIDC-CONFIGURATION-ID-GOES-HERE**
    - run: ./gradlew testWithEmulatorWtf
```
