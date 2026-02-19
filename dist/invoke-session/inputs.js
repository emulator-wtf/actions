import { getOptionalBooleanInput, getOptionalStringInput, } from '../lib/utils.js';
import { getCliNetworkInputs, getEmulatorConfigInputs, } from '../lib/shared-inputs.js';
export function getInvokeSessionInputs() {
    const cliNetworkInputs = getCliNetworkInputs();
    const emulatorConfigInputs = getEmulatorConfigInputs();
    return {
        token: getOptionalStringInput('api-token'),
        outputsDir: getOptionalStringInput('outputs-dir'),
        outputs: getOptionalStringInput('outputs'),
        recordVideo: getOptionalBooleanInput('record-video'),
        maxTimeLimit: getOptionalStringInput('max-time-limit'),
        adbEnabled: getOptionalBooleanInput('adb'),
        adbBinary: getOptionalStringInput('adb-binary'),
        ...cliNetworkInputs,
        ...emulatorConfigInputs,
    };
}
//# sourceMappingURL=inputs.js.map