import { HttpClient } from "@actions/http-client";
export async function authenticateOidc(request) {
    const client = new HttpClient();
    const response = await client.postJson("https://api.emulator.wtf/auth/oidc", request);
    if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.result == null) {
            throw new Error("Unexpected response: null result");
        }
        if (isErrorResponse(response.result)) {
            throw new Error(`Unexpected API response shape: received error body for successful (2xx) status: ${response.result.message}`);
        }
        return response.result;
    }
    if (response.result != null && isErrorResponse(response.result)) {
        throw new Error(`API Error: ${response.result.message}`);
    }
    throw Error(`API call to emulator.wtf failed with status code ${response.statusCode}`);
}
export function isErrorResponse(body) {
    return body.type !== undefined && body.message !== undefined;
}
