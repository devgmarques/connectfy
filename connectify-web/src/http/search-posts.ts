import { api } from '@/lib'
import { Post } from '@/@types'

type SearchPostsRequest = {
  query: string
  page?: number
}

type SearchPostsResponse = {
  posts: Post[]
  meta: {
    countPosts: number
  }
}

export async function searchPosts({
  query,
  page = 1,
}: SearchPostsRequest): Promise<SearchPostsResponse> {
  const posts = await api.get('/posts/search', {
    params: {
      query: query.toLowerCase(),
      page,
    },
  })

  return posts.data
}
