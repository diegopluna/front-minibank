import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from 'better-auth/client/plugins'
import { env } from './env'

export const authClient = createAuthClient({
  baseURL: env.authBaseUrl,
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields({
      user: {
        cpf: { type: 'string', required: false, unique: true },
        address: { type: 'string', required: false },
      },
    }),
  ],
})
