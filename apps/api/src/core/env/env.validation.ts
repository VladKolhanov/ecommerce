import { zStringOptional, zStringRequired } from "@ecommerce/utils"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  PORT: zStringRequired(),
  GLOBAL_PREFIX: zStringRequired(),
  API_VERSION: zStringRequired(),
  LOGTAIL_TOKEN: zStringOptional(),
  LOGTAIL_HOST: zStringOptional(),
  JWT_SECRET: zStringRequired(),
  JWT_EXPIRE: z.coerce.number(),
})

export type EnvConfig = z.infer<typeof envSchema>

export const validateEnvVars = (config: Record<string, unknown>) => {
  const parsedSchema = envSchema.safeParse(config)

  if (!parsedSchema.success) {
    const flattenErrors = z.flattenError(parsedSchema.error)

    const formattedErrorMessages = Object.entries(
      flattenErrors.fieldErrors
    ).reduce((acc, [fieldName, messages]) => {
      const message = messages.reduce((acc, message) => {
        return acc.length === 0 ? `❗ ${message}\n` : `${acc}❗ ${message}\n`
      }, "")

      return `${acc}➡️   ${fieldName}:\n${message}\n`
    }, "\n❌ Invalid environment variables:\n")

    console.error(formattedErrorMessages)
    throw new Error(formattedErrorMessages)
  }

  return parsedSchema.data
}
