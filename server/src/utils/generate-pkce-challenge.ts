/**
 * Generates the PKCE challenge.
 *
 * @returns {Promise<{ code_challenge: string; code_verifier: string }>} An object containing the PKCE code challenge and verifier.
 */
export const generatePkceChallenge = async (): Promise<{
  code_challenge: string;
  code_verifier: string;
}> => {
  const pkceModule = await import("pkce-challenge");
  const { code_challenge, code_verifier } = await pkceModule.default();

  return { code_challenge, code_verifier };
};
