import { getInput, setFailed, warning } from '@actions/core'

import setupEwCli from './setup-ew-cli'
import {invokeSession} from "./invoke-session";
import {getInvokeSessionInputs} from "./invoke-session/inputs";


(async () => {
  try {
    const version = getInput('version')
    setupEwCli(version)
    await invokeSession(getInvokeSessionInputs())
    process.exit(0)
  } catch (error) {
    warning(`invoke-session failed: ${error}`)
    setFailed(error)
  }
})()
