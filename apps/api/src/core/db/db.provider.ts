import { dbClient } from "@ecommerce/data-access"
import { Inject } from "@nestjs/common"

export const DB_PROVIDER = "DbProvider"

export const InjectDb = () => Inject(DB_PROVIDER)

export const dbProvider = {
  provide: DB_PROVIDER,
  useValue: dbClient,
}
