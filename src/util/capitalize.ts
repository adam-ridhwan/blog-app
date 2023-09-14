export function capitalize(str: string): string {
  let words = str.split(' ');
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  return words.join(' ');
}
