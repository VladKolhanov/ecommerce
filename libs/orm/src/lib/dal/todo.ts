import { dbClient } from "../client"

export const getAll = () => {
  const result = dbClient.query.todo.findMany()

  return {
    result,
  }
}
