import { env } from 'next-runtime-env'

export const getRequiredEnvVar = (
  name: string,
  defaultValue?: string | number | boolean,
): string => {
  try {
    const value = env(name)
    if (value) {
      return value
    }
  } catch {
    const envValue = process.env[name]
    if (envValue) {
      return envValue
    }
  }
  return defaultValue ? defaultValue.toString() : ''
}
