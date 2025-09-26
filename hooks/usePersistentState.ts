import { useState, useEffect, Dispatch, SetStateAction } from 'react';

const APP_PREFIX = 'teamSyncHub:';

// Regular expression to check for ISO 8601 date format
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// JSON reviver function to convert ISO date strings back to Date objects
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && isoDateRegex.test(value)) {
    return new Date(value);
  }
  return value;
};

export function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const prefixedKey = APP_PREFIX + key;

  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(prefixedKey);
      if (storedValue) {
        return JSON.parse(storedValue, dateReviver);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${prefixedKey}":`, error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, value]);

  return [value, setValue];
}
