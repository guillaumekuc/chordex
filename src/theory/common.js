/**
 * Safe modulo that always returns a positive result.
 * Example: modulo(-1, 12) === 11
 */

export function modulo(number, modulus) {
  return ((number % modulus) + modulus) % modulus;
}


// Constrain any integer into the range [0, 11].

export function modulo12(number) {
  return modulo(number, 12);
}