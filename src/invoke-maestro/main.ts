import { setFailed, warning } from "@actions/core";
import { getInvokeMaestroInputs } from "./inputs.js";
import { extractErrorMessage } from "../lib/utils.js";

import invokeMaestro from "./index.js";

try {
  await invokeMaestro(getInvokeMaestroInputs());
} catch (e) {
  const msg = extractErrorMessage(e);
  warning(`invoke-maestro failed: ${msg}`);
  setFailed(msg);
}
