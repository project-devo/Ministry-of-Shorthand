const readEnv = (name: string) => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

export const getOptionalEnv = (name: string) => readEnv(name);

export const requireEnv = (name: string) => {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
};

export const hasEnv = (...names: string[]) => names.every((name) => Boolean(readEnv(name)));
