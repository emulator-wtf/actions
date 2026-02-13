import { invokeSession } from './index.js'
import { getInvokeSessionInputs } from './inputs.js'
import { setFailed, warning } from '@actions/core'
import {extractErrorMessage} from "../lib/utils.js";

try {
  await invokeSession(getInvokeSessionInputs())
  process.exit(0)
} catch (error) {
  const msg = extractErrorMessage(error)
  warning(`invoke-session failed: ${msg}`)
  setFailed(msg)
}
