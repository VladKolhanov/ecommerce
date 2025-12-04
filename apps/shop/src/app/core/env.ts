import { z } from 'zod'

const envSchema = z.object({
  MODE: z.enum(['development', 'production']),
  BASE_URL: z.string(),
  PROD: z.boolean(),
  DEV: z.boolean(),
  SSR: z.boolean(),
})

const parsedSchema = envSchema.safeParse(import.meta.env)

if (!parsedSchema.success) {
  const flattenErrors = z.flattenError(parsedSchema.error)

  const formattedErrorMessages = Object.entries(
    flattenErrors.fieldErrors
  ).reduce((acc, [fieldName, messages]) => {
    const message = messages.reduce((acc, message) => {
      return acc.length === 0 ? `❗ ${message}\n` : `${acc}❗ ${message}\n`
    }, '')

    return `${acc}➡️ ${fieldName}:\n${message}\n`
  }, '❌ Invalid environment variables:\n')

  throw new Error(formattedErrorMessages)
}

export const ENV = parsedSchema.data
