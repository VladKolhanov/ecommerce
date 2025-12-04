import { Link } from '@tanstack/react-router'

export const HomePage = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/placeholder">Placeholder</Link>

      <hr />

      <h1>Welcome to React application</h1>
    </div>
  )
}
