export const extractSubstrings = (s: string): string[] => {
  const regex = /{([^}]+)}/g;
  const result: string[] = [];
  let match;
  while ((match = regex.exec(s)) !== null) {
    result.push(match[1]);
  }
  return result;
};
