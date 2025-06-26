// types/iconify.ts

/**
 * Basic icon information
 */
export interface IconInfo {
  name: string;
  fullName: string;
}

/**
 * Author information from Iconify API
 */
export interface IconifyAuthor {
  name: string;
  url?: string;
}

/**
 * License information from Iconify API
 */
export interface IconifyLicense {
  title: string;
  spdx?: string;
  url?: string;
}

/**
 * Icon collection/set information from Iconify API
 */
export interface IconifyCollection {
  id: string;
  name: string;
  total: number;
  author?: IconifyAuthor;
  license?: IconifyLicense;
  samples?: string[];
  height?: number;
  category?: string;
  palette?: boolean;
  version?: string;
  displayHeight?: number;
}

/**
 * Response from /collections endpoint
 */
export interface IconifyCollectionsResponse {
  [collectionId: string]: Omit<IconifyCollection, 'id'>;
}

/**
 * Response from /collection endpoint with icons
 */
export interface IconifyCollectionResponse {
  prefix: string;
  total: number;
  title?: string;
  icons: {
    [iconName: string]: {
      body: string;
      width?: number;
      height?: number;
      left?: number;
      top?: number;
      hFlip?: boolean;
      vFlip?: boolean;
      rotate?: number;
    };
  };
  aliases?: {
    [aliasName: string]: {
      parent: string;
      width?: number;
      height?: number;
      left?: number;
      top?: number;
      hFlip?: boolean;
      vFlip?: boolean;
      rotate?: number;
    };
  };
  chars?: {
    [character: string]: string;
  };
  width?: number;
  height?: number;
}

/**
 * Response from /search endpoint
 */
export interface IconifySearchResponse {
  icons: string[];
  total: number;
  limit: number;
  start: number;
}

/**
 * Search parameters for icon search
 */
export interface IconifySearchParams {
  query: string;
  limit?: number;
  start?: number;
  category?: string;
  collection?: string;
}

/**
 * Collection filter options
 */
export interface CollectionFilter {
  category?: string;
  minIcons?: number;
  maxIcons?: number;
  author?: string;
  license?: string;
}

/**
 * Icon selector component props
 */
export interface IconSelectorProps {
  selectedIcon?: string;
  onIconSelect: (iconName: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxIcons?: number;
  defaultCollection?: string;
  collections?: string[];
  searchEnabled?: boolean;
  showCollectionInfo?: boolean;
}

/**
 * Icon selector state
 */
export interface IconSelectorState {
  isOpen: boolean;
  searchTerm: string;
  icons: IconInfo[];
  loading: boolean;
  collections: IconifyCollection[];
  selectedCollection: string;
  searchMode: boolean;
  error?: string;
}

/**
 * API error response
 */
export interface IconifyApiError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * Cache entry for API responses
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

/**
 * Icon cache interface
 */
export interface IconCache {
  collections: CacheEntry<IconifyCollection[]> | null;
  collectionIcons: Map<string, CacheEntry<IconInfo[]>>;
  searchResults: Map<string, CacheEntry<IconInfo[]>>;
  collectionDetails: Map<string, CacheEntry<IconifyCollectionResponse>>;
}

/**
 * Icon selector configuration
 */
export interface IconSelectorConfig {
  apiBaseUrl: string;
  cacheTimeout: number;
  searchDebounceMs: number;
  maxIconsPerCollection: number;
  maxSearchResults: number;
  fallbackCollections: string[];
  enableCache: boolean;
}

/**
 * Collection category enum
 */
export enum IconifyCategory {
  GENERAL = 'General',
  BRANDS = 'Brands',
  EMOJI = 'Emoji',
  THEMATIC = 'Thematic',
  ARCHIVE = 'Archive'
}

/**
 * Icon style variants
 */
export enum IconStyle {
  OUTLINE = 'outline',
  FILLED = 'filled',
  DUOTONE = 'duotone',
  SOLID = 'solid'
}

/**
 * API endpoint URLs
 */
export const ICONIFY_API_ENDPOINTS = {
  COLLECTIONS: 'https://api.iconify.design/collections',
  COLLECTION: 'https://api.iconify.design/collection',
  SEARCH: 'https://api.iconify.design/search',
  ICON: 'https://api.iconify.design'
} as const;

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: IconSelectorConfig = {
  apiBaseUrl: 'https://api.iconify.design',
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  searchDebounceMs: 300,
  maxIconsPerCollection: 100,
  maxSearchResults: 50,
  fallbackCollections: ['mdi', 'heroicons', 'lucide', 'tabler'],
  enableCache: true
};

/**
 * Type guard for IconifyCollection
 */
export const isIconifyCollection = (obj: any): obj is IconifyCollection => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.total === 'number'
  );
};

/**
 * Type guard for IconifySearchResponse
 */
export const isIconifySearchResponse = (obj: any): obj is IconifySearchResponse => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.icons) &&
    typeof obj.total === 'number' &&
    typeof obj.limit === 'number'
  );
};

/**
 * Type guard for IconifyApiError
 */
export const isIconifyApiError = (obj: any): obj is IconifyApiError => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.error === 'string'
  );
};

/**
 * Utility type for icon name parsing
 */
export interface ParsedIconName {
  collection: string;
  name: string;
  isValid: boolean;
}

/**
 * Icon metadata interface
 */
export interface IconMetadata {
  collection: string;
  name: string;
  fullName: string;
  width?: number;
  height?: number;
  viewBox?: string;
  tags?: string[];
  category?: string;
  author?: string;
  license?: string;
}

/**
 * Component event handlers
 */
export interface IconSelectorEventHandlers {
  onIconSelect: (iconName: string, metadata?: IconMetadata) => void;
  onCollectionChange?: (collectionId: string) => void;
  onSearchChange?: (searchTerm: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: IconifyApiError) => void;
}

/**
 * Hook return type for useIconifyAPI
 */
export interface UseIconifyAPI {
  collections: IconifyCollection[];
  icons: IconInfo[];
  loading: boolean;
  error: string | null;
  searchIcons: (query: string, options?: IconifySearchParams) => Promise<void>;
  fetchCollectionIcons: (collectionId: string, limit?: number) => Promise<void>;
  fetchCollections: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Hook return type for useIconSelector
 */
export interface UseIconSelector {
  isOpen: boolean;
  selectedIcon: string;
  searchTerm: string;
  collections: IconifyCollection[];
  icons: IconInfo[];
  loading: boolean;
  error: string | null;
  openSelector: () => void;
  closeSelector: () => void;
  selectIcon: (iconName: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCollection: (collectionId: string) => void;
}

/**
 * Extended icon information with metadata
 */
export interface ExtendedIconInfo extends IconInfo {
  collection: string;
  category?: string;
  tags?: string[];
  width?: number;
  height?: number;
  author?: string;
  license?: string;
}

/**
 * Icon preview configuration
 */
export interface IconPreviewConfig {
  sizes: number[];
  colors: string[];
  showMetadata: boolean;
  showCode: boolean;
}

/**
 * Icon export formats
 */
export enum IconExportFormat {
  SVG = 'svg',
  PNG = 'png',
  JPG = 'jpg',
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular'
}

/**
 * Icon export options
 */
export interface IconExportOptions {
  format: IconExportFormat;
  size?: number;
  color?: string;
  backgroundColor?: string;
  padding?: number;
}

export default {
  DEFAULT_CONFIG,
  ICONIFY_API_ENDPOINTS
};