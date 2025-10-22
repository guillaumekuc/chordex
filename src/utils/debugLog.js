// Debug logging utility
const DEBUG_ENABLED = true; // Set to true to enable debug logging

export default function debugLog(message, ...args) {
  if (DEBUG_ENABLED) {
    console.log(`${message}`, ...args);
  }
}
