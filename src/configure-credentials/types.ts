export interface OidcAuthenticateRequest {
  oidcConfigurationUuid: string
  oidcToken: string
}

export interface OidcAuthenticateResponse {
  apiToken: string
}

export interface ErrorResponse {
  message: string
}
