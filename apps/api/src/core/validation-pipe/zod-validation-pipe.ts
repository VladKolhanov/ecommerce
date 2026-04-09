import { createZodValidationPipe } from "nestjs-zod"
import { z, ZodError } from "zod"

import { AppException, ErrorCode } from "../exceptions"

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error) => {
    if (error instanceof ZodError) {
      return new AppException({
        code: ErrorCode.VALIDATION_ERROR,
        details: z.treeifyError(error),
      })
    } else {
      return new AppException({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
      })
    }
  },
})
