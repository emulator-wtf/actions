import { getInput, setFailed, warning } from '@actions/core'

import setupEwCli from '../setup-ew-cli/index.js'
import { invokeSession } from '../invoke-session/index.js'
import { getInvokeSessionInputs } from '../invoke-session/inputs.js'
import { extractErrorMessage } from '../lib/utils.js'


(async () => {
  try {
    const version = getInput('version')
    await setupEwCli(version)
    await invokeSession(getInvokeSessionInputs())
    // TODO(madis) I'm surprised this works,
    // we need a direct exit here to "leak" the ew-cli process
    process.exit(0)
  } catch (error) {
    const msg = extractErrorMessage(error)
    warning(`use-emulator failed: ${msg}`)
    setFailed(msg)
  }
})()
