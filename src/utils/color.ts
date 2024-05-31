const stringToNumber = (input: string): number => {
  return input.split("").reduce((acc: number, curr: string) => {
    return acc + curr.charCodeAt(0)
  }, 0)
}

const rng = (seed: number): number => {
  const x = Math.sin(seed++) * 1000
  return x - Math.floor(x)
}

const generateChannel = (seed: string, seedF: number = 1, f: number = 2, n: number = 10) => {
  const channelValue = rng(stringToNumber(seed) * seedF) * 255;
  const finalValue = Math.floor(channelValue / f + n);
  const HEX = Math.max(0, Math.min(255, finalValue)).toString(16);
  return HEX + (HEX.length === 1 ? "0" : "");
}

export const generateColor = (seed: string): string => {
  const r = generateChannel(seed, 1, 2, 10);
  const g = generateChannel(seed, 1.3, 2);
  const b = generateChannel(seed, 1 / 1.3, 2);
  return `#${r}${g}${b}`;
};
