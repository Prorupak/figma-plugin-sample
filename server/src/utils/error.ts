/**
 * Utility function to handle unknown errors.
 *
 * @param error - The caught error, typically of unknown type.
 * @param customMessage - A custom message to prepend to the error.
 * @returns {Error} An instance of Error with the proper message.
 */
export const handleUnknownError = (
  error: unknown,
  customMessage: string
): Error => {
  if (error instanceof Error) {
    return new Error(`${customMessage}: ${error.message}`);
  } else {
    return new Error(`${customMessage}: An unknown error occurred.`);
  }
};
