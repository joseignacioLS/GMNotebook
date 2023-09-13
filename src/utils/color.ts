export const generateColor = (seed: string): string => {
  let numberSeed = seed
    .split("")
    .reduce((acc: number, chr: string, i: number) => {
      return acc * Math.pow(seed.charCodeAt(i), 3);
    }, 1);
  if (numberSeed > 999999) {
    numberSeed -= 999999
  }
  const r = Math.floor(64 + +(numberSeed + "").slice(0, 2)).toString(16);
  const g = Math.floor(64 + +(numberSeed + "").slice(2, 4)).toString(16);
  const b = Math.floor(64 + +(numberSeed + "").slice(4, 6)).toString(16);
  return `#${r}${g}${b}`;
};