
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
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[DEBUG ${timestamp}] ${message}`, data);
    } else {
      console.log(`[DEBUG ${timestamp}] ${message}`);
    }
  }
};

/**
 * Log state changes for easier debugging
 */
export const debugState = <T>(stateName: string, oldValue: T, newValue: T): void => {
  if (isDebugEnabled()) {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG STATE ${timestamp}] ${stateName} changed:`, {
      from: oldValue,
      to: newValue,
      diff: JSON.stringify(oldValue) !== JSON.stringify(newValue)
    });
  }
};

/**
 * Log UI interactions for debugging
 */
export const debugAction = (actionType: string, details?: any): void => {
  if (isDebugEnabled()) {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG ACTION ${timestamp}] ${actionType}`, details || {});
  }
};

/**
 * Log component lifecycle events
 */
export const debugLifecycle = (componentName: string, lifecycle: 'mount' | 'update' | 'unmount', details?: any): void => {
  if (isDebugEnabled()) {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG LIFECYCLE ${timestamp}] ${componentName} ${lifecycle}`, details || {});
  }
};

/**
 * Log events related to user operations (click, submit, etc)
 */
export const debugUserAction = (action: string, details?: any): void => {
  if (isDebugEnabled()) {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG USER ACTION ${timestamp}] ${action}`, details || {});
  }
};

/**
 * Log specific errors with more details
 */
export const debugError = (message: string, error: any): void => {
  if (isDebugEnabled()) {
    const timestamp = new Date().toISOString();
    console.error(`[DEBUG ERROR ${timestamp}] ${message}`, error);
    
    // Log stack trace if available
    if (error && error.stack) {
      console.error(`[DEBUG ERROR STACK ${timestamp}]`, error.stack);
    }
  }
};

/**
 * Clear all debug logs from console
 */
export const clearDebugLogs = (): void => {
  if (isDebugEnabled()) {
    console.clear();
    console.log('[DEBUG] Console cleared');
  }
};
