import * as React from "react";

/**
 * A React hook that returns a debounced version of the provided value.
 *
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A React hook that creates a debounced function that delays invoking the callback.
 *
 * @param callback The function to debounce
 * @param delay The debounce delay in milliseconds (default: 500ms)
 * @returns A debounced callback function
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay = 500,
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const callbackRef = React.useRef(callback);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = React.useRef<Parameters<T> | null>(null);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    argsRef.current = null;
  }, []);

  const flush = React.useCallback(() => {
    if (timeoutRef.current && argsRef.current) {
      callbackRef.current(...argsRef.current);
      cancel();
    }
  }, [cancel]);

  React.useEffect(() => {
    return cancel;
  }, [cancel]);

  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          callbackRef.current(...argsRef.current);
        }
        timeoutRef.current = null;
        argsRef.current = null;
      }, delay);
    },
    [delay],
  );

  return Object.assign(debouncedFn, { cancel, flush });
}
