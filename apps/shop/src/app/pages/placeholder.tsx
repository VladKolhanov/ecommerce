import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const PlaceholderPage = () => {
  const { data, isPending } = useQuery<Todo[]>({
    queryKey: ['placeholder'],
    queryFn: async () => {
      const todos = await fetch(
        'https://jsonplaceholder.typicode.com/todos'
      ).then(async (res) => res.json())

      return todos
    },
  })

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/placeholder">Placeholder</Link>

      <hr />

      <h1>Placeholder Data:</h1>
      {isPending && <p>Loading...</p>}
      {!data && !isPending && <p>Placeholder was not founded</p>}
      {data && (
        <ul>
          {data.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
