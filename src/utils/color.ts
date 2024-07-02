const stringToNumber = (input: string): number => {
  return input.split("").reduce((acc: number, curr: string) => {
    return acc + curr.charCodeAt(0);
  }, 0);
};

const rng = (seed: number): number => {
  const x = Math.sin(seed++) * 1000;
  return x - Math.floor(x);
};

const channelParameters = [
  { seedF: 1, f: 2, n: 10 },
  { seedF: 1.3, f: 2, n: 10 },
  { seedF: 1 / 1.3, f: 2, n: 10 },
];

const generateChannel = (
  seed: string,
  seedF: number = 1,
  f: number = 2,
  n: number = 10
) => {
  const channelValue = rng(stringToNumber(seed) * seedF) * 255;
  const finalValue = Math.floor(channelValue / f + n);
  const HEX = Math.max(0, Math.min(255, finalValue)).toString(16);
  return HEX + (HEX.length === 1 ? "0" : "");
};

export const generateColor = (seed: string): string => {
  const channels = channelParameters.map((params) => {
    return generateChannel(seed, params.seedF, params.f, params.n);
  });
  return `#${channels.join("")}`;
};
