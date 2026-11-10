// The only file that calls fetch. Feature modules call getJson() instead.
// To test the UI states, add a switch to BASE_URL:
// '/delay/3000' (loading), '/fail/500' (error), '/empty' (empty).
const BASE_URL = 'https://shopboard-api.vercel.app'

// Keeps the HTTP status, so the UI can tell "not found" (404) apart from
// other failures that are worth retrying.
export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
  }
}

// Fetches JSON and hands it to `parse`, which checks the unknown data and
// returns it typed (or throws). Each module decides what valid data looks like.
export async function getJson<T>(
  path: string,
  parse: (data: unknown) => T,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  // fetch() does not throw on a 404 or a 500, so check the status here.
  if (!response.ok) {
    throw new ApiError(response.status)
  }

  const data: unknown = await response.json()
  return parse(data)
}
