import { ErrorCode } from './codes.enum'

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.THROW_RANDOM_ERROR]: 'Text of random error',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid data format provided',
} as const
