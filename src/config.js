import { generateRandomString } from './utils/common';

const AUTH_TOKEN = 'AUTH_TOKEN';

const session = sessionStorage.getItem(AUTH_TOKEN);
const authToken = session ?? `Basic ${generateRandomString()}`;

if (!session) {
  sessionStorage.setItem(AUTH_TOKEN, authToken);
}

export const END_POINT = process.env.END_POINT;
export const AUTHORIZATION = authToken;
