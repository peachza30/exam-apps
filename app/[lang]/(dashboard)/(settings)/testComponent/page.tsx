"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';

const IconSelectorWithAPI = ({ onIconSelect, selectedIcon = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  // Fetch all available collections from API
  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch('https://api.iconify.design/collections');
      const data = await response.json();
      
      // Convert object to array and sort by popularity
      const collectionsArray = Object.entries(data).map(([id, info]) => ({
        id,
        name: info.name,
        total: info.total,
        author: info.author?.name || 'Unknown',
        license: info.license?.title || 'Unknown',
        category: info.category || 'General'
      })).sort((a, b) => b.total - a.total); // Sort by icon count
      
      setCollections(collectionsArray);
      if (collectionsArray.length > 0) {
        setSelectedCollection(collectionsArray[0].id);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      // Fallback to static collections if API fails
      setCollections([
        { id: 'mdi', name: 'Material Design Icons', total: 7000 },
        { id: 'heroicons', name: 'Heroicons', total: 300 },
        { id: 'lucide', name: 'Lucide', total: 1000 }
      ]);
      setSelectedCollection('mdi');
    }
  }, []);

  // Fetch icons from specific collection
  const fetchCollectionIcons = useCallback(async (collectionId, limit = 50) => {
    if (!collectionId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.iconify.design/collection?id=${collectionId}&icons`);
      const data = await response.json();
      
      if (data.icons) {
        const iconList = Object.keys(data.icons).slice(0, limit).map(iconName => ({
          name: iconName,
          fullName: `${collectionId}:${iconName}`
        }));
        setIcons(iconList);
      }
    } catch (error) {
      console.error('Error fetching collection icons:', error);
      // Fallback icons
      const fallbackIcons = ['home', 'user', 'settings', 'search', 'heart', 'star'].map(name => ({
        name,
        fullName: `${collectionId}:${name}`
      }));
      setIcons(fallbackIcons);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search icons across all collections
  const searchIcons = useCallback(async (query, limit = 50) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await response.json();
      
      if (data.icons) {
        const iconList = data.icons.map(iconName => ({
          name: iconName.split(':')[1] || iconName,
          fullName: iconName
        }));
        setIcons(iconList);
      }
    } catch (error) {
      console.error('Error searching icons:', error);
      setIcons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize collections on component mount
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Load icons when collection changes or search is performed
  useEffect(() => {
    if (isOpen) {
      if (searchTerm && searchMode) {
        const timeoutId = setTimeout(() => {
          searchIcons(searchTerm);
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
      } else if (selectedCollection && !searchMode) {
        fetchCollectionIcons(selectedCollection);
      }
    }
  }, [isOpen, selectedCollection, searchTerm, searchMode, fetchCollectionIcons, searchIcons]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setSearchMode(term.length > 0);
  };

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setSearchTerm('');
    setSearchMode(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={selectedIcon}
          onChange={(e) => onIconSelect(e.target.value)}
          placeholder="Select an icon or type icon name..."
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          {selectedIcon ? (
            <Icon icon={selectedIcon} className="w-5 h-5 text-gray-600" />
          ) : (
            <Icon icon="mdi:chevron-down" className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search all icons..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchMode && (
              <div className="mt-2 text-sm text-blue-600">
                🔍 Searching across all {collections.length} collections...
              </div>
            )}
          </div>

          {/* Collection Selector (only show when not searching) */}
          {!searchMode && (
            <div className="p-3 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Collection ({collections.length} available):
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => handleCollectionChange(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} ({collection.total?.toLocaleString()} icons)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Icons Grid */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icon icon="mdi:loading" className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">
                  {searchMode ? 'Searching icons...' : 'Loading collection...'}
                </span>
              </div>
            ) : icons.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50">
                  {searchMode ? `Found ${icons.length} icons` : `Showing ${icons.length} icons from ${selectedCollection}`}
                </div>
                <div className="grid grid-cols-6 gap-1 p-3">
                  {icons.map((icon) => (
                    <button
                      key={icon.fullName}
                      onClick={() => {
                        onIconSelect(icon.fullName);
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded-md transition-colors group"
                      title={icon.fullName}
                    >
                      <Icon 
                        icon={icon.fullName} 
                        className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" 
                      />
                      <span className="text-xs text-gray-500 mt-1 truncate max-w-full group-hover:text-blue-600">
                        {icon.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchMode ? 'No icons found for this search' : 'No icons available'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Collections Explorer Component
const CollectionsExplorer = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.iconify.design/collections');
      const data = await response.json();
      
      const collectionsArray = Object.entries(data).map(([id, info]) => ({
        id,
        ...info
      })).sort((a, b) => b.total - a.total);
      
      setCollections(collectionsArray.slice(0, 20)); // Show top 20
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Available Icon Collections
        </h3>
        <button
          onClick={fetchCollections}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon icon="mdi:loading" className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Fetching collections from API...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="p-3 bg-white rounded-md border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedCollection(selectedCollection?.id === collection.id ? null : collection)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{collection.name}</h4>
                  <p className="text-xs text-gray-600">
                    {collection.total?.toLocaleString()} icons • {collection.id}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {collection.samples?.slice(0, 3).map((sample, idx) => (
                    <Icon 
                      key={idx}
                      icon={`${collection.id}:${sample}`} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  ))}
                </div>
              </div>
              {selectedCollection?.id === collection.id && (
                <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                  <p><strong>Author:</strong> {collection.author?.name || 'Unknown'}</p>
                  <p><strong>License:</strong> {collection.license?.title || 'Unknown'}</p>
                  <p><strong>Category:</strong> {collection.category || 'General'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Demo Component
export default function IconifySelector() {
  const [selectedIcon, setSelectedIcon] = useState('mdi:api');

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon Selector with Live API:
            </label>
            <IconSelectorWithAPI 
              selectedIcon={selectedIcon}
              onIconSelect={setSelectedIcon}
            />
          </div>

          {/* Preview Selected Icon */}
          {selectedIcon && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Selected Icon Preview:
              </h3>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center space-y-2">
                  <Icon icon={selectedIcon} className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-600">Small</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Icon icon={selectedIcon} className="w-8 h-8 text-green-600" />
                  <span className="text-sm text-gray-600">Medium</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Icon icon={selectedIcon} className="w-12 h-12 text-purple-600" />
                  <span className="text-sm text-gray-600">Large</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Icon Name:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs">{selectedIcon}</code>
                </p>
              </div>
            </div>
          )}

          {/* API Features
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              🚀 API Features:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Dynamic Collections:</strong> Fetches all available icon sets from API</li>
              <li>• <strong>Live Search:</strong> Search across 200+ icon collections in real-time</li>
              <li>• <strong>Collection Browser:</strong> Browse icons by specific collections</li>
              <li>• <strong>Auto-fallback:</strong> Falls back to static icons if API is unavailable</li>
              <li>• <strong>Performance:</strong> Debounced search and caching for better UX</li>
              <li>• <strong>Rich Metadata:</strong> Shows icon counts, authors, and licenses</li>
            </ul>
          </div>

          <CollectionsExplorer /> */}
        </div>
      </div>
    </div>
  );
}