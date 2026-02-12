import { getInput, setFailed, warning } from '@actions/core'

import setupEwCli from '../setup-ew-cli/index.js'
import { invokeSession } from '../invoke-session/index.js'
import { getInvokeSessionInputs } from '../invoke-session/inputs.js'


(async () => {
  try {
    const version = getInput('version')
    await setupEwCli(version)
    await invokeSession(getInvokeSessionInputs())
    process.exit(0)
  } catch (error) {
    warning(`invoke-session failed: ${error}`)
    setFailed(error)
  }
})()
