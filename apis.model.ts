// Updated API Models based on new OpenAPI specification

// User Profile Schema
interface UserProfileSchema {
  /** Unique identifier for the user */
  id: string;

  /** User's email address */
  email: string;

  /** User's full name */
  name: string;

  /** User's phone number */
  phone: string | null;

  /** Whether the user is active */
  is_active: boolean;

  /** When the user was created */
  created_at: string;

  /** When the user was last updated */
  updated_at: string;
}

// Legacy User interface for backward compatibility
interface User {
  /** Unique identifier for the user */
  id: number;

  /** User's email address */
  email: string;

  /** User's full name */
  name: string;

  /** Whether the user's email has been verified */
  email_verified: boolean;

  /** Whether the user has completed their profile */
  profile_completed: boolean;
}

// Asset List Schema (from PagedListAssetOut)
interface ListAssetOut {
  /** Unique identifier for the asset */
  id: number;

  /** Category the asset belongs to */
  category: string;

  /** Name of the asset */
  name: string;

  /** Description/summary of the asset */
  description: string;

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
  };

  /** License name */
  license: string;
}

// Asset Detail Schema (from DetailAssetOut)
interface DetailAssetOut {
  /** Unique identifier for the asset */
  id: number;

  /** Category the asset belongs to */
  category: string;

  /** Name of the asset */
  name: string;

  /** Description/summary of the asset */
  description: string;

  /** Long description of the asset */
  long_description: string;

  /** URL to the asset's thumbnail image */
  thumbnail_url: string;

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
    /** Description of the publisher */
    description: string;
  };

  /** License name */
  license: string;

  /** Preview snapshots of the asset content */
  snapshots?: Array<{
    /** URL to snapshot image */
    image_url: string;
    /** Title describing the snapshot */
    title: string;
    /** Detailed description of the snapshot */
    description: string;
  }>;
}

// Legacy Asset interface for backward compatibility
interface Asset {
  /** Unique identifier for the asset */
  id: number;

  /** Title of the asset */
  title: string;

  /** Description/summary of the asset */
  description: string;

  /** URL to the asset's thumbnail image */
  thumbnail_url: string;

  /** Category the asset belongs to */
  category: string;

  /** License information for the asset */
  license: {
    /** License code (e.g. cc0, cc-by) */
    code: string;
    /** Full name of the license */
    name: string;
  };

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
    /** URL to the publisher's thumbnail/logo */
    thumbnail_url: string;
  };

  /** Whether the current user has access to download this asset */
  has_access: boolean;

  /** Number of times this asset has been downloaded */
  download_count: number;

  /** Size of the asset file */
  file_size: string;
}

// Resource Schemas
interface ListResourceOut {
  /** Unique identifier for the resource */
  id: number;

  /** Category the resource belongs to */
  category: string;

  /** Name of the resource */
  name: string;

  /** Description of the resource */
  description: string;

  /** Status of the resource */
  status: string;

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
  };

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

interface DetailResourceOut {
  /** Unique identifier for the resource */
  id: number;

  /** Category the resource belongs to */
  category: string;

  /** Name of the resource */
  name: string;

  /** URL slug for the resource */
  slug: string;

  /** Description of the resource */
  description: string;

  /** Status of the resource */
  status: string;

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
    /** Description of the publisher */
    description: string;
  };

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

// Publisher Schema
interface DetailPublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Name of the publisher */
  name: string;

  /** URL slug for the publisher */
  slug: string;

  /** Description of the publisher */
  description: string;

  /** Address of the publisher */
  address: string;

  /** Website of the publisher */
  website: string;

  /** Whether the publisher is verified */
  is_verified: boolean;

  /** Contact email of the publisher */
  contact_email: string;

  /** Icon URL of the publisher */
  icon_url: string | null;
}

// Access Request Schemas
interface RequestAccessIn {
  /** Purpose of the access request */
  purpose: string;

  /** Intended use (commercial or non-commercial) */
  intended_use: 'commercial' | 'non-commercial';
}

interface AccessRequestOut {
  /** Unique identifier for the access request */
  id: number;

  /** Asset ID the request is for */
  asset_id: number;

  /** Purpose of the access request */
  purpose: string;

  /** Intended use */
  intended_use: string;

  /** Status of the request */
  status: string;

  /** Creation timestamp */
  created_at: string;
}

interface AccessGrantOut {
  /** Unique identifier for the access grant */
  id: number;

  /** Asset ID the grant is for */
  asset_id: number;

  /** Expiration timestamp */
  expires_at: string | null;

  /** Whether the grant is active */
  is_active: boolean;
}

interface AssetAccessStatusOut {
  /** Whether the user has access */
  has_access: boolean;

  /** Whether approval is required */
  requires_approval: boolean;
}

// Legacy AssetDetails interface for backward compatibility
interface AssetDetails {
  /** Unique identifier for the asset */
  id: number;

  /** Title of the asset */
  title: string;

  /** Description/summary of the asset */
  description: string;

  /** URL to the asset's thumbnail image */
  thumbnail_url: string;

  /** Category the asset belongs to */
  category: 'mushaf' | 'tafsir' | 'recitation';

  /** License information for the asset */
  license: {
    /** License code (e.g. cc0, cc-by) */
    code: string;
    /** Full name of the license */
    name: string;
  };

  /** Preview snapshots of the asset content */
  snapshots: Array<{
    /** URL to snapshot thumbnail */
    thumbnail_url: string;
    /** Title describing the snapshot */
    title: string;
    /** Detailed description of the snapshot */
    description: string;
  }>;

  /** Publisher information */
  publisher: {
    /** Unique identifier for the publisher */
    id: number;
    /** Name of the publisher */
    name: string;
    /** URL to the publisher's thumbnail/logo */
    thumbnail_url: string;
    /** Publisher biography/description */
    bio?: string;
    /** Whether publisher is verified */
    verified?: boolean;
  };

  /** Resource collection information */
  resource: {
    /** Unique identifier for the resource */
    id: number;
    /** Title of the resource collection */
    title: string;
    /** Description of the resource collection */
    description: string;
  };

  /** Technical specifications of the asset */
  technical_details: {
    /** Size of the asset file */
    file_size: string;
    /** File format */
    format: string;
    /** Character encoding */
    encoding: string;
    /** Version number */
    version: string;
    /** Content language */
    language: string;
  };

  /** Usage statistics */
  stats: {
    /** Number of downloads */
    download_count: number;
    /** Number of views */
    view_count: number;
    /** Creation timestamp */
    created_at: string;
    /** Last update timestamp */
    updated_at: string;
  };

  /** Access control information */
  access: {
    /** Whether current user has download access */
    has_access: boolean;
  };
}