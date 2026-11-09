export function normalizePhoneNumber(input, defaultCountryCode = '1') {
  // SLS 1: Require a string and normalize the default country prefix
  if (typeof input !== 'string') return { valid: false, number: null, extension: null, reason: 'INVALID_INPUT' };
  const country = String(defaultCountryCode).replace(/\D/g, '');
  const trimmed = input.trim();
  const extensionMatch = trimmed.match(/(?:ext\.?|x|#)\s*(\d+)\s*$/i);
  const extension = extensionMatch ? extensionMatch[1] : null;
  const numberPart = extensionMatch ? trimmed.slice(0, extensionMatch.index) : trimmed;

  // SLS 2: Remove non-digit formatting from the base number
  let digits = '';
  for (let index = 0; index < numberPart.length; index++) {
    const char = numberPart[index];
    if (char >= '0' && char <= '9') digits += char;
  }
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

  // SLS 3: Reject a local number made entirely of zeroes before adding a country prefix
  let localHasNonZero = false;
  for (let index = 0; index < digits.length; index++) {
    if (digits[index] !== '0') localHasNonZero = true;
  }
  if (!localHasNonZero) {
    return { valid: false, number: null, extension, reason: 'INVALID_NUMBER' };
  }

  // SLS 4: Add default country code only for a ten-digit local number
  if (digits.length === 10) {
    digits = country + digits;
  } else if (digits.length < 10 || digits.length > 15) {
    return { valid: false, number: null, extension, reason: 'INVALID_LENGTH' };
  }

  // SLS 5: Ensure the normalized international number begins with a non-zero digit
  let allZero = true;
  let cursor = 0;
  while (cursor < digits.length) {
    if (digits[cursor] !== '0') allZero = false;
    cursor++;
  }
  if (allZero) return { valid: false, number: null, extension, reason: 'INVALID_NUMBER' };

  // SLS 6: Return normalized E.164-like digits and parsed extension separately
  return { valid: true, number: `+${digits}`, extension, reason: null };
}
