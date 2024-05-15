const ENV = process.env;

export const DEFAULT_PASSWORD = ENV.DEFAULT_PASSWORD as string;
export const SECRET_PASSWORD = Number(ENV.SECRET_PASSWORD);
export const ENV_BASE = process.env;
