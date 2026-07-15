import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.string().default("3001").transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  
  XENDIT_SECRET_KEY: z.string().min(1),
  XENDIT_WEBHOOK_TOKEN: z.string().min(1),
  XENDIT_SUCCESS_REDIRECT_URL: z.string().url(),
  XENDIT_FAILURE_REDIRECT_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
