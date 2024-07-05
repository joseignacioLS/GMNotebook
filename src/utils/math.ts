export const clamp = (
  value: number,
  minimum: number,
  maximum: number
): number => {
  return Math.max(Math.min(value, maximum), minimum);
};

export const rng = (seed: number): number => {
  const x = Math.sin(seed++) * 1000;
  return x - Math.floor(x);
};
