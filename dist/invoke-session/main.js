import { invokeSession } from './index.js';
import { getInvokeSessionInputs } from './inputs.js';
import { setFailed, warning } from '@actions/core';
(async () => {
    try {
        await invokeSession(getInvokeSessionInputs());
        process.exit(0);
    }
    catch (error) {
        warning(`invoke-session failed: ${error}`);
        setFailed(error);
    }
})();
//# sourceMappingURL=main.js.map