export const DBConfig = {
  NAME: process.env.DB_NAME || "",
  PORT: process.env.DB_PORT  || 3306,
  USER: process.env.DB_USER || "",
  PASSWORD: process.env.DB_PASSWORD || "",
  HOST: process.env.DB_HOST || "",
};
