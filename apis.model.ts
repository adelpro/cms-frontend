// AUTH
// in APIs doc

// Profile completion
// in APIs doc
// FURTHER DISCUSSION NEEDED

// Assets
// in APIs doc

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