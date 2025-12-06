import { Link } from '@tanstack/react-router'

import { Button } from '~/shared/components/ui/button'

export const HomePage = () => {
  return (
    <div>
      <Link to="/">Home</Link>і<Link to="/placeholder">Placeholder</Link>
      <hr />
      <h1>Welcome to React application</h1>
      <Button>Button Component from base-ui</Button>
    </div>
  )
}
