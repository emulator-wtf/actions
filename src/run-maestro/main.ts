import { getInput, setFailed, warning } from "@actions/core";

import setupEwCli from "../setup-ew-cli/index.js";
import { extractErrorMessage } from "../lib/utils.js";
import { getInvokeMaestroInputs } from "../invoke-maestro/inputs.js";
import invokeMaestro from "../invoke-maestro/index.js";

try {
  const version = getInput("version");
  await setupEwCli(version);
  await invokeMaestro(getInvokeMaestroInputs());
} catch (error) {
  const msg = extractErrorMessage(error);
  warning(`run-maestro failed: ${msg}`);
  setFailed(msg);
}
