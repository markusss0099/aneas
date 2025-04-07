
// Simple debug utility to control debugging features
const DEBUG_KEY = 'cashflow-debug-enabled';

/**
 * Check if debugging is enabled
 */
export const isDebugEnabled = (): boolean => {
  return localStorage.getItem(DEBUG_KEY) === 'true';
};

/**
 * Enable debugging
 */
export const enableDebug = (): void => {
  localStorage.setItem(DEBUG_KEY, 'true');
  console.log('Debug mode enabled');
};

/**
 * Disable debugging
 */
export const disableDebug = (): void => {
  localStorage.setItem(DEBUG_KEY, 'false');
  console.log('Debug mode disabled');
};

/**
 * Toggle debug state
 */
export const toggleDebug = (): boolean => {
  const newState = !isDebugEnabled();
  localStorage.setItem(DEBUG_KEY, newState.toString());
  console.log(`Debug mode ${newState ? 'enabled' : 'disabled'}`);
  return newState;
};

/**
 * Debug log function that only logs when debug is enabled
 */
export const debugLog = (message: string, data?: any): void => {
  if (isDebugEnabled()) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
};
