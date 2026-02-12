import { invokeSession } from './index.js'
import { getInvokeSessionInputs } from './inputs.js'
import { setFailed } from '@actions/core'

(async () => {
  try {
    await invokeSession(getInvokeSessionInputs())
  } catch (error) {
    warning(`invoke-session failed: ${e}`)
    setFailed(e)
  }
  process.exit(0)
})()
