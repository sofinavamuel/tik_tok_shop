import type {
  StrapiMarket,
  StrapiCreator,
  StrapiVideo,
  StrapiBriefing,
  StrapiListResponse,
  StrapiSingleResponse,
} from './types';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<StrapiListResponse<T>> {
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

// ── Generic CRUD ──

export async function getAll<T>(endpoint: string, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchAPI<T>(`${endpoint}${qs}`);
}

export async function getById<T>(endpoint: string, id: number | string) {
  return fetchAPISingle<T>(`${endpoint}/${id}?populate=*`);
}

export async function create<T>(endpoint: string, data: Record<string, unknown>) {
  return fetchAPISingle<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function update<T>(endpoint: string, id: number | string, data: Record<string, unknown>) {
  return fetchAPISingle<T>(`${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

export async function remove(endpoint: string, id: number | string) {
  return fetchAPISingle<never>(`${endpoint}/${id}`, {
    method: 'DELETE',
  });
}

// ── Markets ──

export async function getMarkets(params?: Record<string, string>) {
  return getAll<StrapiMarket>('/markets', params);
}

export async function getMarket(id: number | string) {
  return getById<StrapiMarket>('/markets', id);
}

export async function createMarket(data: Record<string, unknown>) {
  return create<StrapiMarket>('/markets', data);
}

export async function updateMarket(id: number | string, data: Record<string, unknown>) {
  return update<StrapiMarket>('/markets', id, data);
}

export async function deleteMarket(id: number | string) {
  return remove('/markets', id);
}

// ── Creators ──

export async function getCreators(params?: Record<string, string>) {
  return getAll<StrapiCreator>('/creators', params);
}

export async function getCreator(id: number | string) {
  return getById<StrapiCreator>('/creators', id);
}

export async function createCreator(data: Record<string, unknown>) {
  return create<StrapiCreator>('/creators', data);
}

export async function updateCreator(id: number | string, data: Record<string, unknown>) {
  return update<StrapiCreator>('/creators', id, data);
}

export async function deleteCreator(id: number | string) {
  return remove('/creators', id);
}

// ── Videos ──

export async function getVideos(params?: Record<string, string>) {
  return getAll<StrapiVideo>('/videos', params);
}

export async function getVideo(id: number | string) {
  return getById<StrapiVideo>('/videos', id);
}

export async function createVideo(data: Record<string, unknown>) {
  return create<StrapiVideo>('/videos', data);
}

export async function updateVideo(id: number | string, data: Record<string, unknown>) {
  return update<StrapiVideo>('/videos', id, data);
}

export async function deleteVideo(id: number | string) {
  return remove('/videos', id);
}

// ── Briefings ──

export async function getBriefings(params?: Record<string, string>) {
  return getAll<StrapiBriefing>('/briefings', params);
}

export async function getBriefing(id: number | string) {
  return getById<StrapiBriefing>('/briefings', id);
}

export async function createBriefing(data: Record<string, unknown>) {
  return create<StrapiBriefing>('/briefings', data);
}

export async function updateBriefing(id: number | string, data: Record<string, unknown>) {
  return update<StrapiBriefing>('/briefings', id, data);
}

export async function deleteBriefing(id: number | string) {
  return remove('/briefings', id);
}
