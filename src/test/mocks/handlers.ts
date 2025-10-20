import { http, HttpResponse } from 'msw';

import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        profile_completed: true,
      },
    });
  }),

  http.post(`${API_URL}/auth/register/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        profile_completed: false,
      },
    });
  }),

  http.get(`${API_URL}/auth/profile/`, () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      bio: 'Test bio',
      project_summary: 'Test project',
      project_url: 'https://example.com',
      job_title: 'Developer',
      profile_completed: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });
  }),

  http.put(`${API_URL}/auth/profile/`, () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      bio: 'Updated bio',
      project_summary: 'Updated project',
      project_url: 'https://example.com',
      job_title: 'Developer',
      profile_completed: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });
  }),

  http.post(`${API_URL}/auth/token/refresh/`, () => {
    return HttpResponse.json({
      access: 'new-mock-access-token',
      refresh: 'new-mock-refresh-token',
    });
  }),

  // Assets endpoints
  http.get(`${API_URL}/assets/`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: 'Test Asset 1',
          description: 'Test description 1',
          category: 'mushaf',
          publisher: { id: 1, name: 'Publisher 1' },
          license: 'CC0',
        },
        {
          id: 2,
          name: 'Test Asset 2',
          description: 'Test description 2',
          category: 'tafsir',
          publisher: { id: 2, name: 'Publisher 2' },
          license: 'CC-BY',
        },
      ],
    });
  }),

  http.get(`${API_URL}/assets/1/`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Asset 1',
      description: 'Test description',
      long_description: 'Long test description',
      category: 'mushaf',
      license: 'CC0',
      thumbnail_url: 'https://example.com/thumb1.jpg',
      publisher: {
        id: 1,
        name: 'Publisher 1',
        description: 'Publisher 1 description',
      },
      resource: { id: 1 },
      snapshots: [
        {
          image_url: 'https://example.com/snapshot1.jpg',
          title: 'Snapshot 1',
          description: 'Snapshot 1 description',
        },
      ],
    });
  }),

  http.get(`${API_URL}/assets/1/access-status/`, () => {
    return HttpResponse.json({
      has_access: true,
      requires_approval: false,
    });
  }),

  http.post(`${API_URL}/assets/1/request-access/`, () => {
    return HttpResponse.json({
      request: {
        id: 1,
        asset_id: 1,
        purpose: 'Test purpose',
        intended_use: 'non-commercial',
        status: 'pending',
        created_at: '2025-01-01T00:00:00Z',
      },
      access: null,
    });
  }),

  http.get(`${API_URL}/assets/1/download/`, () => {
    return HttpResponse.json({
      download_url: '/downloads/asset-1.zip',
    });
  }),

  // Publisher endpoints
  http.get(`${API_URL}/publishers/1/`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Publisher',
      slug: 'test-publisher',
      description: 'Test publisher description',
      address: 'Test Address',
      website: 'https://example.com',
      is_verified: true,
      contact_email: 'contact@example.com',
      icon_url: 'https://example.com/icon.jpg',
    });
  }),

  // Resources endpoints
  http.get(`${API_URL}/resources/`, () => {
    return HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: 'Test Resource',
          description: 'Test resource description',
          category: 'mushaf',
          status: 'ready',
          publisher: { id: 1, name: 'Publisher 1' },
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
    });
  }),

  http.get(`${API_URL}/resources/1/`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Resource',
      slug: 'test-resource',
      description: 'Test resource description',
      category: 'mushaf',
      status: 'ready',
      publisher: {
        id: 1,
        name: 'Publisher 1',
        description: 'Publisher 1 description',
      },
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });
  }),

  http.get(`${API_URL}/resources/1/download/`, () => {
    return HttpResponse.json({
      download_url: '/downloads/resource-1.zip',
    });
  }),
];
