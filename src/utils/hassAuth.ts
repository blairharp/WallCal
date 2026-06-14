let _auth: unknown = null

export function setHassAuth(auth: unknown) {
  _auth = auth
}

export async function getAccessToken(): Promise<string | null> {
  if (!_auth) return null
  const a = _auth as any
  if (typeof a.getValidToken === 'function') {
    return a.getValidToken()
  }
  // hass.auth may be a plain object {data: {access_token}} without getValidToken
  return a.data?.access_token ?? null
}
