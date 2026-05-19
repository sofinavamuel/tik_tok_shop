const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; total: number } };
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<StrapiResponse<T>> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchAPISingle<T>(endpoint: string, options?: RequestInit): Promise<StrapiSingleResponse<T>> {
  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getMarkets() {
  return fetchAPI('/markets');
}

export async function getCreators() {
  return fetchAPI('/creators');
}

export async function createVideo(data: Record<string, unknown>) {
  return fetchAPISingle('/videos', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function createBriefing(data: Record<string, unknown>) {
  return fetchAPISingle('/briefings', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}
