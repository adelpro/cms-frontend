import { describe, it, expect } from 'vitest';

import {
  convertUserProfileToUser,
  convertListAssetToAsset,
  convertDetailAssetToAssetDetails,
  convertDetailPublisherToPublisher,
  getLicenseColor,
  getAssetType,
  convertUserRegistrationToApiFormat,
  convertUserProfileUpdateToApiFormat,
} from '../conversion.utils';

describe('User Profile Conversion', () => {
  it('should convert API user profile to internal user format', () => {
    const apiUser = {
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      bio: 'Test bio',
      project_summary: 'Test project',
      project_url: 'https://example.com',
      job_title: 'Developer',
      profile_completed: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    const result = convertUserProfileToUser(apiUser);

    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      phoneNumber: '+1234567890',
      provider: 'email',
      profileCompleted: true,
    });
  });

  it('should handle user with incomplete profile', () => {
    const apiUser = {
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
      phone: null,
      bio: null,
      project_summary: null,
      project_url: null,
      job_title: null,
      profile_completed: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    const result = convertUserProfileToUser(apiUser);

    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: undefined,
      phoneNumber: undefined,
      provider: 'email',
      profileCompleted: false,
    });
  });

  it('should handle single name', () => {
    const apiUser = {
      id: 1,
      email: 'test@example.com',
      name: 'John',
      phone: null,
      bio: null,
      project_summary: null,
      project_url: null,
      job_title: null,
      profile_completed: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    const result = convertUserProfileToUser(apiUser);

    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('');
  });
});

describe('Asset Conversion', () => {
  it('should convert API asset to internal format', () => {
    const apiAsset = {
      id: 1,
      name: 'Test Asset',
      description: 'Test description',
      category: 'mushaf',
      publisher: { id: 1, name: 'Test Publisher' },
      license: 'CC0',
    };

    const result = convertListAssetToAsset(apiAsset);

    expect(result).toEqual({
      id: '1',
      title: 'Test Asset',
      description: 'Test description',
      publisher: 'Test Publisher',
      license: 'CC0',
      category: 'mushaf',
      type: 'translation',
    });
  });

  it('should map category to correct type', () => {
    const testCases = [
      { category: 'mushaf', expectedType: 'translation' },
      { category: 'tafsir', expectedType: 'tafsir' },
      { category: 'recitation', expectedType: 'audio' },
    ];

    testCases.forEach(({ category, expectedType }) => {
      const apiAsset = {
        id: 1,
        name: 'Test Asset',
        description: 'Test description',
        category,
        publisher: { id: 1, name: 'Test Publisher' },
        license: 'CC0',
      };

      const result = convertListAssetToAsset(apiAsset);
      expect(result.type).toBe(expectedType);
    });
  });
});

describe('Asset Details Conversion', () => {
  it('should convert detailed asset to asset details format', () => {
    const apiAsset = {
      id: 1,
      name: 'Test Asset',
      description: 'Test description',
      long_description: 'Long test description',
      category: 'mushaf',
      license: 'CC0',
      thumbnail_url: 'https://example.com/thumb.jpg',
      publisher: {
        id: 1,
        name: 'Test Publisher',
        description: 'Publisher description',
      },
      resource: { id: 1 },
      snapshots: [
        {
          image_url: 'https://example.com/snapshot1.jpg',
          title: 'Snapshot 1',
          description: 'Snapshot 1 description',
        },
      ],
    };

    const result = convertDetailAssetToAssetDetails(apiAsset);

    expect(result).toEqual({
      id: '1',
      title: 'Test Asset',
      description: 'Test description',
      longDescription: 'Long test description',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      publisher: 'Test Publisher',
      license: 'CC0',
      category: 'mushaf',
      type: 'translation',
      snapshots: [
        {
          imageUrl: 'https://example.com/snapshot1.jpg',
          title: 'Snapshot 1',
          description: 'Snapshot 1 description',
        },
      ],
    });
  });
});

describe('Publisher Conversion', () => {
  it('should convert API publisher to internal format', () => {
    const apiPublisher = {
      id: 1,
      name: 'Test Publisher',
      slug: 'test-publisher',
      description: 'Publisher description',
      address: 'Test Address',
      website: 'https://example.com',
      is_verified: true,
      contact_email: 'contact@example.com',
      icon_url: 'https://example.com/icon.jpg',
    };

    const result = convertDetailPublisherToPublisher(apiPublisher);

    expect(result).toEqual({
      id: 1,
      name: 'Test Publisher',
      icon_url: 'https://example.com/icon.jpg',
      bio: 'Publisher description',
    });
  });

  it('should handle publisher without icon', () => {
    const apiPublisher = {
      id: 1,
      name: 'Test Publisher',
      slug: 'test-publisher',
      description: 'Publisher description',
      address: 'Test Address',
      website: 'https://example.com',
      is_verified: true,
      contact_email: 'contact@example.com',
      icon_url: null,
    };

    const result = convertDetailPublisherToPublisher(apiPublisher);

    expect(result.icon_url).toBeNull();
  });
});

describe('License Color Mapping', () => {
  it('should return correct colors for different licenses', () => {
    const testCases = [
      { license: 'CC0', expectedColor: 'green' },
      { license: 'CC BY', expectedColor: 'green' },
      { license: 'CC BY-SA', expectedColor: 'yellow' },
      { license: 'CC BY-ND', expectedColor: 'yellow' },
      { license: 'CC BY-NC', expectedColor: 'yellow' },
      { license: 'CC BY-NC-SA', expectedColor: 'red' },
      { license: 'CC BY-NC-ND', expectedColor: 'red' },
      { license: 'Unknown License', expectedColor: 'yellow' },
    ];

    testCases.forEach(({ license, expectedColor }) => {
      expect(getLicenseColor(license)).toBe(expectedColor);
    });
  });
});

describe('Asset Type Mapping', () => {
  it('should return correct types for different categories', () => {
    const testCases = [
      { category: 'mushaf', expectedType: 'translation' },
      { category: 'tafsir', expectedType: 'tafsir' },
      { category: 'recitation', expectedType: 'audio' },
      { category: 'unknown', expectedType: 'translation' },
    ];

    testCases.forEach(({ category, expectedType }) => {
      expect(getAssetType(category)).toBe(expectedType);
    });
  });
});

describe('User Registration Conversion', () => {
  it('should convert registration data to API format', () => {
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      title: 'Developer',
      phoneNumber: '+1234567890',
    };

    const result = convertUserRegistrationToApiFormat(registrationData);

    expect(result).toEqual({
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '+1234567890',
      job_title: 'Developer',
    });
  });
});

describe('User Profile Update Conversion', () => {
  it('should convert profile update data to API format', () => {
    const updateData = {
      name: 'John Doe',
      bio: 'Updated bio',
      project_summary: 'Updated project',
      project_url: 'https://example.com',
    };

    const result = convertUserProfileUpdateToApiFormat(updateData);

    expect(result).toEqual({
      name: 'John Doe',
      bio: 'Updated bio',
      project_summary: 'Updated project',
      project_url: 'https://example.com',
    });
  });

  it('should handle partial update data', () => {
    const updateData = {
      name: 'John Doe',
      bio: 'Updated bio',
    };

    const result = convertUserProfileUpdateToApiFormat(updateData);

    expect(result).toEqual({
      name: 'John Doe',
      bio: 'Updated bio',
      project_summary: undefined,
      project_url: undefined,
    });
  });
});
