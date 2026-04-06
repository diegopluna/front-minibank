import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from './v1'

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
  credentials: 'include',
})

export const $api = createClient(fetchClient)
