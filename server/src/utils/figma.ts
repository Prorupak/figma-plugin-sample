import { FIGMA_CLIENT_ID, REDIRECT_URI } from "./globals.js";

/**
 * Constructs the Figma OAuth redirect URL.
 *
 * @param {string} writeKey - The unique write key used for authentication.
 * @param {string} code_challenge - The PKCE code challenge.
 * @returns {string} The constructed redirect URL.
 */
export const constructRedirectUrl = (
  writeKey: string,
  code_challenge: string
): string => {
  const state = encodeURIComponent(writeKey);
  return `https://www.figma.com/oauth?response_type=code&client_id=${FIGMA_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256&scope=file_read`;
};
