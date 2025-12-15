import type { Provider } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { AllExceptionsFilter } from './all-exceptions.filter'

export const AllExceptionsFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
}
