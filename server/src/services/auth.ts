import {
  TCheckSessionResponse,
  TFirebaseKeysResponse,
  TFirebaseUsersResponse,
  TPKCEVerifierResponse,
  TTokenResponseData,
  TUserDataResponse,
} from "../types.js";
import { handleUnknownError } from "../utils/error.js";
import { constructRedirectUrl } from "../utils/figma.js";
import {
  deleteFromFirebase,
  fetchFromFirebase,
  saveToFirebase,
} from "../utils/firebase.js";
import { generatePkceChallenge } from "../utils/generate-pkce-challenge.js";
import { generateRandomKey } from "../utils/generate-random-key.js";
import {
  FIGMA_CLIENT_ID,
  FIGMA_CLIENT_SECRET,
  REDIRECT_URI,
} from "../utils/globals.js";

/**
 * Generates a pair of read and write keys, and saves the write key to Firebase.
 *
 * @returns {Promise<{readKey: string, writeKey: string}>} A promise that resolves to an object containing the read and write keys.
 * @throws {Error} If an error occurs while generating keys or saving to Firebase.
 */
export const generateKeys = async (): Promise<{
  readKey: string;
  writeKey: string;
}> => {
  try {
    const readKey: string = generateRandomKey();
    const writeKey: string = generateRandomKey();

    await saveToFirebase(`keys/${writeKey}`, { readKey, token: null });

    return { readKey, writeKey };
  } catch (error) {
    throw handleUnknownError(error, "Failed to generate keys");
  }
};

/**
 * Authenticates the user by generating a PKCE challenge and constructing the OAuth redirect URL.
 *
 * @param {string} writeKey - The unique write key used for authentication.
 * @returns {Promise<string>} The Figma OAuth redirect URL.
 */
export const generateFigmaAuthUrl = async (
  writeKey: string
): Promise<string> => {
  try {
    const { code_challenge, code_verifier } = await generatePkceChallenge();
    await saveToFirebase(`pkceStore/${writeKey}`, { code_verifier });

    return constructRedirectUrl(writeKey, code_challenge);
  } catch (error) {
    throw handleUnknownError(
      error,
      "Failed to generate the OAuth redirect URL"
    );
  }
};

/**
 * Handles the OAuth callback from Figma, exchanges the authorization code for a token, and retrieves user information.
 *
 * @param {string} code - The authorization code returned from Figma OAuth.
 * @param {string} state - The state parameter, used to validate the writeKey.
 * @returns {Promise<void>}
 * @throws {Error} If the PKCE verifier is missing or if the token/user information retrieval fails.
 */
export const handleFigmaOAuthCallback = async (
  code: string,
  state: string
): Promise<void> => {
  const writeKey = decodeURIComponent(state);

  // Fetch the PKCE verifier from Firebase
  const pkceData = await fetchFromFirebase<TPKCEVerifierResponse>(
    `pkceStore/${writeKey}`
  );
  const code_verifier = pkceData?.code_verifier;

  if (!code_verifier) {
    throw { message: "Invalid or missing PKCE verifier.", statusCode: 400 };
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch("https://www.figma.com/api/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: FIGMA_CLIENT_ID!,
      client_secret: FIGMA_CLIENT_SECRET!,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier,
    }),
  });

  if (!tokenResponse.ok) {
    const errorDetails = await tokenResponse.text();
    throw new Error(`Failed to exchange code for token. ${errorDetails}`);
  }

  const tokenData = (await tokenResponse.json()) as TTokenResponseData;
  const accessToken = tokenData.access_token;

  // Fetch user information using the access token
  const userResponse = await fetch("https://api.figma.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    const userErrorDetails = await userResponse.text();
    throw new Error(`Failed to fetch user information. ${userErrorDetails}`);
  }

  const userData = (await userResponse.json()) as TUserDataResponse;
  const { id: userId, handle, email } = userData;

  // Save the session data to Firebase
  await saveToFirebase(`sessions/${userId}`, {
    token: accessToken,
    handle,
    email,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
    writeKey,
  });

  // Clean up the PKCE store in Firebase
  await deleteFromFirebase(`pkceStore/${writeKey}`);
};

/**
 * Polls the Firebase store for a session associated with the provided readKey.
 *
 * @async
 * @function pollForUserSession
 * @param {string} readKey - The read key used to identify the corresponding write key.
 * @returns {Promise<{ user: TCheckSessionResponse; userId: string } | null>} The user session data and userId if found, or null if not found.
 * @throws {Error} If an error occurs while fetching or deleting data from Firebase.
 */
export const pollForUserSession = async (
  readKey: string
): Promise<{ user: TCheckSessionResponse; userId: string } | null> => {
  try {
    const keysData = await fetchFromFirebase<TFirebaseKeysResponse>("keys");

    for (const [writeKey, value] of Object.entries(keysData ?? {})) {
      if (value.readKey === readKey) {
        const userSessions = await fetchFromFirebase<TFirebaseUsersResponse>(
          "sessions"
        );

        for (const [userId, userValue] of Object.entries(userSessions ?? {})) {
          if (userValue.writeKey === writeKey) {
            // Clean up the keys store
            await deleteFromFirebase(`keys/${writeKey}`);
            return { user: userValue, userId };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error while polling for user session:", error);
    throw handleUnknownError(error, "Failed to poll for user session");
  }
};

/**
 * Checks if a session is valid for a given userId by verifying its existence and expiration time.
 *
 * @param {string} userId - The unique ID of the user whose session is being checked.
 * @returns {Promise<{ token: string } | null>} The session token if valid, or null if the session is expired or not found.
 * @throws {Error} If an error occurs while fetching session data.
 */
export const checkSession = async (
  userId: string
): Promise<{ token: string } | null> => {
  try {
    const sessionData = await fetchFromFirebase<TCheckSessionResponse>(
      `sessions/${userId}`
    );

    if (!sessionData || sessionData.expiresAt < Date.now()) {
      return null;
    }

    return { token: sessionData.token };
  } catch (error) {
    console.error("Error while checking session:", error);
    throw handleUnknownError(error, "Failed to check session");
  }
};
