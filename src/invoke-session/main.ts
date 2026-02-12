import { invokeSession } from './index.js'
import { getInvokeSessionInputs } from './inputs.js'
import { setFailed } from '@actions/core'

try {
  invokeSession(getInvokeSessionInputs())
} catch (error) {
  warning(`invoke-session failed: ${e}`)
  setFailed(e)
}
process.exit(0)
