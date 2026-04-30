function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export const env = {
  authBaseUrl: required(
    'NEXT_PUBLIC_BETTER_AUTH_BASE_URL',
    process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
  ),
}
