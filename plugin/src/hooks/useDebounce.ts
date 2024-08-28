/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

/**
 * useDebounceCallback hook
 *
 * Returns a debounced version of a function that delays invoking it until after a specified delay.
 *
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds after which the function should be invoked.
 * @returns A debounced function.
 *
 * @example
 * const debounce = useDebounceCallback((newQuery: string) => {
 *   setQuery(newQuery);
 *   setResults([]);
 *   setCurrent(undefined);
 *   setSearching(newQuery !== '');
 *   parent.postMessage({ pluginMessage: { query: newQuery } }, '*');
 * }, 300);
 */
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}
