import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().default('https://placeholder.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-role-key'),
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/postgres'),

  // CORS
  FRONTEND_URL: z.string().default('*'),

  // Xendit
  XENDIT_SECRET_KEY: z.string().default('xnd_development_placeholder'),
  XENDIT_WEBHOOK_TOKEN: z.string().default('placeholder_webhook_token'),
  XENDIT_SUCCESS_REDIRECT_URL: z.string().default('http://localhost:5173/success'),
  XENDIT_FAILURE_REDIRECT_URL: z.string().default('http://localhost:5173/failure'),

  // Resend (Email Service)
  RESEND_API_KEY: z.string().default('your_resend_api_key_here'),
  RESEND_FROM_EMAIL: z.string().min(1).default('Balivio <noreply@balivio.id>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('⚠️ Environment variable validation warnings:');
  parsed.error.issues.forEach((issue) => {
    console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
}

export const env = parsed.success ? parsed.data : envSchema.parse({});
export type Env = typeof env;
