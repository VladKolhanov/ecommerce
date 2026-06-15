import { createZodValidationPipe } from "nestjs-zod"
import { z, ZodError } from "zod"

import { InternalServerException } from "../exceptions/system.exception"
import { RequestValidationException } from "../exceptions/validation.exception"

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error) => {
    if (error instanceof ZodError) {
      return new RequestValidationException(z.treeifyError(error))
    } else {
      return new InternalServerException("Unexpected validation error")
    }
  },
})
