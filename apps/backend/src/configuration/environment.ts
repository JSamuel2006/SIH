import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('4000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().default('arogyaverse-super-secret-jwt-key-2026'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/arogyaverse_db'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  BHASHINI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string({
    required_error: 'GEMINI_API_KEY is required. Please set it in the apps/backend/.env file.',
  }).min(5, 'GEMINI_API_KEY must be a valid non-empty string.'),
});

export const env = envSchema.parse(process.env);

