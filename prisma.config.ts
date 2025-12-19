import "dotenv/config";
import { defineConfig } from "prisma/config";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: requireEnv("DATABASE_URL"),
  },
});
