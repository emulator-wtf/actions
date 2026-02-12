import { invokeSession } from './index.js'
import { getInvokeSessionInputs } from './inputs.js'
import { setFailed, warning } from '@actions/core'

(async () => {
  try {
    await invokeSession(getInvokeSessionInputs())
  } catch (error) {
    warning(`invoke-session failed: ${error}`)
    setFailed(error)
  }
  process.exit(0)
})()
