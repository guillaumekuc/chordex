/**
 * Safe modulo that always returns a positive result.
 * Example: modulo(-1, 12) === 11
 */

export function modulo(n, m) {
  return ((n % m) + m) % m;
}


// Constrain any integer into the range [0, 11].

export function modulo12(n) {
  return modulo(n, 12);
}