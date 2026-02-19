import {
  getInput,
  getIDToken,
  exportVariable,
  setSecret,
  warning,
  setFailed,
} from "@actions/core";
import { authenticateOidc } from "./api.js";
import { extractErrorMessage } from "../lib/utils.js";

async function run(): Promise<void> {
  const oidcConfigurationUuid = getInput("oidc-configuration-id", {
    required: true,
  });

  try {
    const oidcToken = await getIDToken("api://emulator.wtf");

    // make api request to the OIDC configuration endpoint
    const response = await authenticateOidc({
      oidcConfigurationUuid,
      oidcToken,
    });

    // export EW_API_TOKEN to environment
    exportVariable("EW_API_TOKEN", response.apiToken);
    // mark it as a secret
    setSecret(response.apiToken);
  } catch (error) {
    // check for "Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable" error
    if (
      error instanceof Error &&
      error.message.includes(
        "Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable",
      )
    ) {
      throw new Error(
        "This action requires the 'id-token' permission to be set in the workflow. Please add the following to your workflow file:\n\n" +
          "permissions:\n  id-token: write\n",
        { cause: error },
      );
    } else {
      throw error;
    }
  }
}

try {
  await run();
} catch (e) {
  const msg = extractErrorMessage(e);
  warning(`configure-credentials failed: ${msg}`);
  setFailed(msg);
}
