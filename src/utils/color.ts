export const generateColor = (seed: string): string => {
  let numberSeed = seed.split("").reduce((acc: number, chr: string) => {
    return acc * Math.pow(chr.charCodeAt(0), 3);
  }, 1);
  if (numberSeed > 999999) {
    numberSeed -= 999999;
  }
  const r = Math.floor(64 + +(numberSeed + "").slice(0, 2)).toString(16);
  const g = Math.floor(64 + +(numberSeed + "").slice(2, 4)).toString(16);
  const b = Math.floor(64 + +(numberSeed + "").slice(4, 6)).toString(16);
  return `#${r}${g}${b}`;
};
