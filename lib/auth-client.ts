import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
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
