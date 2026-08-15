import he from 'he';

const CHAR_CODE_UPPERCASE_START = 65;
const CHAR_CODE_UPPERCASE_END = 90;
const CHAR_CODE_LOWERCASE_START = 97;
const CHAR_CODE_LOWERCASE_END = 122;
const CHAR_CODE_DIGIT_START = 48;
const CHAR_CODE_DIGIT_END = 57;
const RANNDOM_STRING_DEFAULT_LENGTH = 12;

function generateRandomString(length = RANNDOM_STRING_DEFAULT_LENGTH) {
  let result = '';
  const ranges = [
    [CHAR_CODE_UPPERCASE_START, CHAR_CODE_UPPERCASE_END],
    [CHAR_CODE_LOWERCASE_START, CHAR_CODE_LOWERCASE_END],
    [CHAR_CODE_DIGIT_START, CHAR_CODE_DIGIT_END]
  ];

  for (let i = 0; i < length; i++) {
    const [min, max] = ranges[Math.floor(Math.random() * ranges.length)];
    const charCode = min + Math.floor(Math.random() * (max - min + 1));
    result += String.fromCharCode(charCode);
  }
  return result;
}

const escapeHtml = (value) => he.encode(String(value ?? ''));

export {
  generateRandomString,
  escapeHtml,
};
