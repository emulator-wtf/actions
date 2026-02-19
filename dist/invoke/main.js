import { setFailed, warning } from '@actions/core';
import { getInvokeInputs } from './inputs.js';
import { extractErrorMessage } from '../lib/utils.js';
import invoke from './index.js';
try {
    await invoke(getInvokeInputs());
}
catch (e) {
    const msg = extractErrorMessage(e);
    warning(`invoke failed: ${msg}`);
    setFailed(msg);
}
//# sourceMappingURL=main.js.map