import crypto from "crypto";

/**
 * Generates a random hexadecimal key using crypto module.
 * @returns {string} A random hexadecimal string key.
 */
export const generateRandomKey = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
