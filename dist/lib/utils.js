import { getBooleanInput, getInput, getMultilineInput } from '@actions/core';
export function getOptionalStringInput(name) {
    const value = getInput(name);
    return undefinedIfEmpty(value);
}
export function getOptionalBooleanInput(name) {
    const value = getOptionalStringInput(name);
    if (value !== undefined) {
        return getBooleanInput(name);
    }
    return undefined;
}
export function getOptionalMultilineInput(name) {
    const value = getMultilineInput(name).map(x => x.trim()).filter(x => x.length > 0);
    if (value.length > 0) {
        return value;
    }
    return undefined;
}
export function undefinedIfEmpty(value) {
    if (value == null || value.trim() === '') {
        return undefined;
    }
    return value;
}
export function extractErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred: ' + JSON.stringify(error);
}
//# sourceMappingURL=utils.js.map