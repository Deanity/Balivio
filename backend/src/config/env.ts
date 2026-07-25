import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // CORS
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),

  // Xendit
  XENDIT_SECRET_KEY: z.string().min(1, 'XENDIT_SECRET_KEY is required'),
  XENDIT_WEBHOOK_TOKEN: z.string().min(1, 'XENDIT_WEBHOOK_TOKEN is required'),
  XENDIT_SUCCESS_REDIRECT_URL: z.string().url(),
  XENDIT_FAILURE_REDIRECT_URL: z.string().url(),

  // Resend (Email Service)
  RESEND_API_KEY: z.string().default('your_resend_api_key_here'),
  RESEND_FROM_EMAIL: z.string().min(1).default('Balivio <noreply@balivio.id>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
