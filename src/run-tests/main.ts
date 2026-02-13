import { getInput, setFailed, warning } from '@actions/core'

import setupEwCli from '../setup-ew-cli/index.js'
import { extractErrorMessage } from '../lib/utils.js'
import { getInvokeInputs } from '../invoke/inputs.js';
import invoke from '../invoke/index.js';


try {
  const version = getInput('version')
  await setupEwCli(version)
  await invoke(getInvokeInputs())
} catch (error) {
  const msg = extractErrorMessage(error)
  warning(`run-tests failed: ${msg}`)
  setFailed(msg)
}
