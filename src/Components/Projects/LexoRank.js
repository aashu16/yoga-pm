const MIN_CHAR = "A".charCodeAt(0);
const MAX_CHAR = "z".charCodeAt(0);

export const insert = (prev, next) => {
  if (prev === "") {
    prev = string(MIN_CHAR);
  }
  if (next === "") {
    next = string(MAX_CHAR);
  }

  let rank = "";
  let i = 0;

  while (true) {
    let prevChar = getChar(prev, i, MIN_CHAR);
    let nextChar = getChar(next, i, MAX_CHAR);

    if (prevChar === nextChar) {
      rank += string(prevChar);
      i++;
      continue;
    }

    let midChar = mid(prevChar, nextChar);
    if (midChar === prevChar || midChar === nextChar) {
      rank += string(prevChar);
      i++;
      continue;
    }

    rank += string(midChar);
    break;
  }

  if (rank >= next) {
    return [prev, false];
  }
  return [rank, true];
};

const byte = (char) => {
  return char.charCodeAt(0);
};

const string = (byte) => {
  return String.fromCharCode(byte);
};

const mid = (prev, next) => {
  // TODO: consider to use 8 steps each jump
  return Math.floor((prev + next) / 2);
};

const getChar = (s, i, defaultChar) => {
  if (i >= s.length) {
    return defaultChar;
  }
  return byte(s.charAt(i));
};
