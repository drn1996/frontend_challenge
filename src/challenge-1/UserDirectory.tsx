import { useEffect, useState } from 'react'
import { fetchUsers } from '../api/mockApi'
import { UserCard } from './UserCard'
import type { User } from './types'

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true);
    fetchUsers().then(users => setUsers(users)).catch(e => setError(e)).finally(() => setLoading(false))
  }, [])

  return {
    users, loading, error
  }
}

export function UserDirectory() {
  const { users, loading, error } = useGetUsers();

  return (
    <div className="user-directory">
      <h2>User Directory</h2>
      {error ? "There was a error, try again later" : loading ? "Loading ..." : users ? users.map(user => <UserCard key={user.name} user={user} />) : "No users"}
    </div>
  )
}
