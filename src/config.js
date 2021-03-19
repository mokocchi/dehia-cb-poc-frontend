import { GATEWAY_URL } from "./env";

export const API_HOST = GATEWAY_URL;

export const API_BASE_URL = `${API_HOST}/api/v1.0`;

export const TOKEN_AUTH_URL = `${API_HOST}/login`;

export const REQUEST_COUNT = 10;