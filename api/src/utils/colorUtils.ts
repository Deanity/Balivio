const ESC = "\x1b[";
const RESET = "\x1b[0m";

export const colors = {
  green: (text: string | number) => `${ESC}32m${text}${RESET}`,
  cyan: (text: string | number) => `${ESC}36m${text}${RESET}`,
  yellow: (text: string | number) => `${ESC}33m${text}${RESET}`,
  magenta: (text: string | number) => `${ESC}35m${text}${RESET}`,
  red: (text: string | number) => `${ESC}31m${text}${RESET}`,
  gray: (text: string | number) => `${ESC}90m${text}${RESET}`,
  bold: (text: string | number) => `${ESC}1m${text}${RESET}`,
  white: (text: string | number) => `${ESC}97m${text}${RESET}`,
};

export default colors;
