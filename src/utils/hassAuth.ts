let _auth: { getValidToken: () => Promise<string> } | null = null

export function setHassAuth(auth: { getValidToken: () => Promise<string> }) {
  _auth = auth
}

export async function getAccessToken(): Promise<string | null> {
  if (!_auth) return null
  return _auth.getValidToken()
}
