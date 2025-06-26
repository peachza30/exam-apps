// hooks/useIconify.ts
"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  IconifyCollection,
  IconInfo,
  UseIconifyAPI,
  UseIconSelector,
  IconifySearchParams,
  IconCache,
  CacheEntry,
  DEFAULT_CONFIG,
  ICONIFY_API_ENDPOINTS,
  ParsedIconName,
  IconMetadata
} from '@/types/iconify/iconify';

/**
 * Utility function to parse icon names
 */
export const parseIconName = (iconName: string): ParsedIconName => {
  const parts = iconName.split(':');
  if (parts.length === 2) {
    return {
      collection: parts[0],
      name: parts[1],
      isValid: true
    };
  }
  return {
    collection: '',
    name: iconName,
    isValid: false
  };
};

/**
 * Utility function to validate icon name format
 */
export const isValidIconName = (iconName: string): boolean => {
  return parseIconName(iconName).isValid;
};

/**
 * Cache management hook
 */
export const useIconCache = () => {
  const cache = useRef<IconCache>({
    collections: null,
    collectionIcons: new Map(),
    searchResults: new Map(),
    collectionDetails: new Map()
  });

  const isExpired = <T,>(entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > entry.expiresIn;
  };

  const setCache = <T,>(key: string, data: T, type: keyof IconCache): void => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: DEFAULT_CONFIG.cacheTimeout
    };

    switch (type) {
      case 'collections':
        cache.current.collections = entry as CacheEntry<IconifyCollection[]>;
        break;
      case 'collectionIcons':
      case 'searchResults':
      case 'collectionDetails':
        (cache.current[type] as Map<string, CacheEntry<any>>).set(key, entry);
        break;
    }
  };

  const getCache = <T,>(key: string, type: keyof IconCache): T | null => {
    let entry: CacheEntry<T> | null = null;

    switch (type) {
      case 'collections':
        entry = cache.current.collections as CacheEntry<T> | null;
        break;
      case 'collectionIcons':
      case 'searchResults':
      case 'collectionDetails':
        entry = (cache.current[type] as Map<string, CacheEntry<T>>).get(key) || null;
        break;
    }

    if (entry && !isExpired(entry)) {
      return entry.data;
    }

    // Remove expired entries
    if (entry && isExpired(entry)) {
      if (type !== 'collections') {
        (cache.current[type] as Map<string, CacheEntry<any>>).delete(key);
      } else {
        cache.current.collections = null;
      }
    }

    return null;
  };

  const clearCache = (): void => {
    cache.current = {
      collections: null,
      collectionIcons: new Map(),
      searchResults: new Map(),
      collectionDetails: new Map()
    };
  };

  const getCacheStats = () => {
    return {
      collectionsCount: cache.current.collections ? 1 : 0,
      collectionIconsCount: cache.current.collectionIcons.size,
      searchResultsCount: cache.current.searchResults.size,
      collectionDetailsCount: cache.current.collectionDetails.size
    };
  };

  return { setCache, getCache, clearCache, getCacheStats };
};

/**
 * Main Iconify API hook
 */
export const useIconifyAPI = (): UseIconifyAPI => {
  const [collections, setCollections] = useState<IconifyCollection[]>([]);
  const [icons, setIcons] = useState<IconInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { setCache, getCache, clearCache } = useIconCache();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel any ongoing requests
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const fetchCollections = useCallback(async (): Promise<void> => {
    // Check cache first
    const cached = getCache<IconifyCollection[]>('collections', 'collections');
    if (cached) {
      setCollections(cached);
      return;
    }

    setLoading(true);
    setError(null);
    cancelRequest();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(ICONIFY_API_ENDPOINTS.COLLECTIONS, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const collectionsArray: IconifyCollection[] = Object.entries(data).map(([id, info]: [string, any]) => ({
        id,
        name: info.name,
        total: info.total,
        author: info.author,
        license: info.license,
        samples: info.samples,
        height: info.height,
        category: info.category,
        palette: info.palette,
        version: info.version
      })).sort((a, b) => b.total - a.total);

      setCollections(collectionsArray);
      setCache('collections', collectionsArray, 'collections');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const errorMessage = err.message || 'Failed to fetch collections';
        setError(errorMessage);
        console.error('Error fetching collections:', err);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [getCache, setCache, cancelRequest]);

  const fetchCollectionIcons = useCallback(async (
    collectionId: string, 
    limit: number = DEFAULT_CONFIG.maxIconsPerCollection
  ): Promise<void> => {
    const cacheKey = `${collectionId}-${limit}`;
    const cached = getCache<IconInfo[]>(cacheKey, 'collectionIcons');
    
    if (cached) {
      setIcons(cached);
      return;
    }

    setLoading(true);
    setError(null);
    cancelRequest();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const url = `${ICONIFY_API_ENDPOINTS.COLLECTION}?id=${collectionId}&icons`;
      const response = await fetch(url, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.icons) {
        throw new Error('No icons found in collection');
      }

      const iconList: IconInfo[] = Object.keys(data.icons)
        .slice(0, limit)
        .map(iconName => ({
          name: iconName,
          fullName: `${collectionId}:${iconName}`
        }));

      setIcons(iconList);
      setCache(cacheKey, iconList, 'collectionIcons');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const errorMessage = err.message || `Failed to fetch icons from ${collectionId}`;
        setError(errorMessage);
        console.error(`Error fetching collection ${collectionId}:`, err);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [getCache, setCache, cancelRequest]);

  const searchIcons = useCallback(async (
    query: string, 
    options: IconifySearchParams = {}
  ): Promise<void> => {
    const { limit = DEFAULT_CONFIG.maxSearchResults, category, collection } = options;
    const cacheKey = `${query}-${limit}-${category || ''}-${collection || ''}`;
    const cached = getCache<IconInfo[]>(cacheKey, 'searchResults');
    
    if (cached) {
      setIcons(cached);
      return;
    }

    if (!query.trim()) {
      setIcons([]);
      return;
    }

    setLoading(true);
    setError(null);
    cancelRequest();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const searchParams = new URLSearchParams({
        query: query.trim(),
        limit: limit.toString()
      });

      if (category) searchParams.append('category', category);
      if (collection) searchParams.append('collection', collection);

      const url = `${ICONIFY_API_ENDPOINTS.SEARCH}?${searchParams.toString()}`;
      const response = await fetch(url, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.icons || !Array.isArray(data.icons)) {
        throw new Error('Invalid search response format');
      }

      const iconList: IconInfo[] = data.icons.map((iconName: string) => ({
        name: iconName.split(':')[1] || iconName,
        fullName: iconName
      }));

      setIcons(iconList);
      setCache(cacheKey, iconList, 'searchResults');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const errorMessage = err.message || `Failed to search for "${query}"`;
        setError(errorMessage);
        console.error(`Error searching icons with query "${query}":`, err);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [getCache, setCache, cancelRequest]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRequest();
    };
  }, [cancelRequest]);

  return {
    collections,
    icons,
    loading,
    error,
    searchIcons,
    fetchCollectionIcons,
    fetchCollections,
    clearCache
  };
};

/**
 * Icon selector state management hook
 */
export const useIconSelector = (
  initialIcon: string = '',
  onIconChange?: (icon: string) => void
): UseIconSelector => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>(initialIcon);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('mdi');

  const {
    collections,
    icons,
    loading,
    error,
    searchIcons,
    fetchCollectionIcons,
    fetchCollections
  } = useIconifyAPI();

  const openSelector = useCallback(() => {
    setIsOpen(true);
    if (collections.length === 0) {
      fetchCollections();
    }
  }, [collections.length, fetchCollections]);

  const closeSelector = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  const selectIcon = useCallback((iconName: string) => {
    setSelectedIcon(iconName);
    onIconChange?.(iconName);
    closeSelector();
  }, [onIconChange, closeSelector]);

  const handleSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchIcons(term);
    } else if (selectedCollection) {
      fetchCollectionIcons(selectedCollection);
    }
  }, [searchIcons, fetchCollectionIcons, selectedCollection]);

  const handleSelectedCollection = useCallback((collectionId: string) => {
    setSelectedCollection(collectionId);
    setSearchTerm('');
    fetchCollectionIcons(collectionId);
  }, [fetchCollectionIcons]);

  // Initialize with default collection
  useEffect(() => {
    if (isOpen && !searchTerm && selectedCollection) {
      fetchCollectionIcons(selectedCollection);
    }
  }, [isOpen, searchTerm, selectedCollection, fetchCollectionIcons]);

  return {
    isOpen,
    selectedIcon,
    searchTerm,
    collections,
    icons,
    loading,
    error,
    openSelector,
    closeSelector,
    selectIcon,
    setSearchTerm: handleSearchTerm,
    setSelectedCollection: handleSelectedCollection
  };
};

/**
 * Hook for icon metadata and utilities
 */
export const useIconMetadata = () => {
  const getIconMetadata = useCallback((iconName: string): IconMetadata | null => {
    const parsed = parseIconName(iconName);
    if (!parsed.isValid) return null;

    return {
      collection: parsed.collection,
      name: parsed.name,
      fullName: iconName,
      // Additional metadata would be fetched from API if needed
    };
  }, []);

  const generateIconCode = useCallback((iconName: string, framework: 'react' | 'vue' | 'angular' = 'react'): string => {
    const templates = {
      react: `<Icon icon="${iconName}" className="w-6 h-6" />`,
      vue: `<Icon icon="${iconName}" class="w-6 h-6" />`,
      angular: `<iconify-icon icon="${iconName}" class="w-6 h-6"></iconify-icon>`
    };

    return templates[framework];
  }, []);

  const getIconUrl = useCallback((iconName: string, options: { size?: number; color?: string } = {}): string => {
    const { size = 24, color } = options;
    const baseUrl = 'https://api.iconify.design';
    const colorParam = color ? `&color=${encodeURIComponent(color)}` : '';
    return `${baseUrl}/${iconName}.svg?width=${size}&height=${size}${colorParam}`;
  }, []);

  return {
    getIconMetadata,
    generateIconCode,
    getIconUrl,
    parseIconName,
    isValidIconName
  };
};

/**
 * Hook for icon favorites/recent icons
 */
export const useIconFavorites = (storageKey: string = 'iconify-favorites') => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(storageKey);
      const savedRecent = localStorage.getItem(`${storageKey}-recent`);
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedRecent) {
        setRecent(JSON.parse(savedRecent));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, [storageKey]);

  const addToFavorites = useCallback((iconName: string) => {
    setFavorites(prev => {
      const updated = prev.includes(iconName) ? prev : [...prev, iconName];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
      return updated;
    });
  }, [storageKey]);

  const removeFromFavorites = useCallback((iconName: string) => {
    setFavorites(prev => {
      const updated = prev.filter(icon => icon !== iconName);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
      return updated;
    });
  }, [storageKey]);

  const addToRecent = useCallback((iconName: string) => {
    setRecent(prev => {
      const updated = [iconName, ...prev.filter(icon => icon !== iconName)].slice(0, 20);
      try {
        localStorage.setItem(`${storageKey}-recent`, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent icons:', error);
      }
      return updated;
    });
  }, [storageKey]);

  const isFavorite = useCallback((iconName: string): boolean => {
    return favorites.includes(iconName);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, [storageKey]);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(`${storageKey}-recent`);
    } catch (error) {
      console.error('Error clearing recent icons:', error);
    }
  }, [storageKey]);

  return {
    favorites,
    recent,
    addToFavorites,
    removeFromFavorites,
    addToRecent,
    isFavorite,
    clearFavorites,
    clearRecent
  };
};

export default {
  useIconifyAPI,
  useIconSelector,
  useIconMetadata,
  useIconFavorites,
  useIconCache,
  parseIconName,
  isValidIconName
};