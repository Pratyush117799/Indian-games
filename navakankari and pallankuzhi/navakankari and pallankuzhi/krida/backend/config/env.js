import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  PORT:         process.env.PORT         ?? 3001,
  NODE_ENV:     process.env.NODE_ENV     ?? 'development',
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/krida',
  JWT_SECRET:   process.env.JWT_SECRET   ?? 'krida-dev-secret-change-in-production',
  CLIENT_URL:   process.env.CLIENT_URL   ?? 'http://localhost:5173',
}
