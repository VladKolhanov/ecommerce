import { ErrorCode } from './codes.enum'

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid data format provided',
} as const
