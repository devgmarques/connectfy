import { api } from '@/lib'
import { User } from '@/@types'

type FetchUsersResponse = User[]

export async function fetchUsers(): Promise<FetchUsersResponse> {
  const users = await api.get('/users/fetch')

  return users.data
}
