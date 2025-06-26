
import React, { useState, DragEvent } from 'react';
import { GripVertical, ChevronRight, ChevronDown } from 'lucide-react';
// @ts-ignore
import { Icon } from '@iconify/react';

/**
 * Menu Management Component with Drag & Drop
 * 
 * Features:
 * - Drag and drop to reorder menus
 * - Move items between parent/child relationships
 * - Track changes compared to original structure
 * - Export only changed items as JSON
 * - Visual indicators for modified items
 * 
 * Note: This component uses @iconify/react for icons.
 * If not available in your environment, replace with your preferred icon library.
 */

interface MenuItem {
  id: number;
  menu_name: string;
  parent_id: number;
  icon: string | null;
  path: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  active: boolean;
  children: MenuItem[];
}

type DropPosition = 'before' | 'after' | 'inside';

interface DropZone {
  targetId: number | null;
  position: DropPosition;
  parentId: number;
}

const MenuManagement: React.FC = () => {
  const initialMenusData: MenuItem[] = [
    {
      "id": 1,
      "menu_name": "Dashboard",
      "parent_id": 0,
      "icon": "solar:screencast-2-bold-duotone",
      "path": "dashboard",
      "can_create": true,
      "can_read": true,
      "can_update": true,
      "can_delete": true,
      "active": true,
      "children": []
    },
    {
      "id": 2,
      "menu_name": "Settings",
      "parent_id": 0,
      "icon": "solar:settings-bold-duotone",
      "path": "settings",
      "can_create": true,
      "can_read": true,
      "can_update": true,
      "can_delete": true,
      "active": true,
      "children": [
        {
          "id": 3,
          "menu_name": "Role Management",
          "parent_id": 2,
          "icon": "solar:layers-bold-duotone",
          "path": "role-management",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": true,
          "children": [
            {
              "id": 4,
              "menu_name": "Roles List",
              "parent_id": 3,
              "icon": null,
              "path": "roles-list",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": false,
              "children": []
            },
            {
              "id": 5,
              "menu_name": "Manage Role",
              "parent_id": 3,
              "icon": null,
              "path": "manage-role",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            }
          ]
        },
        {
          "id": 6,
          "menu_name": "Menu Management",
          "parent_id": 2,
          "icon": "solar:widget-bold-duotone",
          "path": "menu-management",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": true,
          "children": [
            {
              "id": 7,
              "menu_name": "Menus List",
              "parent_id": 6,
              "icon": null,
              "path": "menus-list",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            },
            {
              "id": 8,
              "menu_name": "Add/Edit Menus",
              "parent_id": 6,
              "icon": null,
              "path": "manage-menus",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            }
          ]
        },
        {
          "id": 9,
          "menu_name": "Service Management",
          "parent_id": 2,
          "icon": "solar:box-minimalistic-bold-duotone",
          "path": "service-management",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": true,
          "children": [
            {
              "id": 10,
              "menu_name": "Service List",
              "parent_id": 9,
              "icon": null,
              "path": "service-list",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            },
            {
              "id": 11,
              "menu_name": "Add/Edit Services",
              "parent_id": 9,
              "icon": null,
              "path": "manage-services",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            }
          ]
        },
        {
          "id": 12,
          "menu_name": "Partner Management",
          "parent_id": 2,
          "icon": "solar:buildings-bold-duotone",
          "path": "partner-management",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": true,
          "children": [
            {
              "id": 13,
              "menu_name": "Partner List",
              "parent_id": 12,
              "icon": null,
              "path": "partner-list",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            },
            {
              "id": 14,
              "menu_name": "Add/Edit Partner",
              "parent_id": 12,
              "icon": null,
              "path": "manage-partner",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            }
          ]
        },
        {
          "id": 15,
          "menu_name": "User Management",
          "parent_id": 2,
          "icon": "solar:users-group-rounded-bold-duotone",
          "path": "user-management",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": true,
          "children": []
        },
        {
          "id": 18,
          "menu_name": "System Settings",
          "parent_id": 2,
          "icon": "mingcute:settings-6-line",
          "path": "system-settings",
          "can_create": true,
          "can_read": true,
          "can_update": true,
          "can_delete": true,
          "active": false,
          "children": [
            {
              "id": 19,
              "menu_name": "Global Configs",
              "parent_id": 18,
              "icon": null,
              "path": "global-configs",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": true,
              "children": []
            },
            {
              "id": 20,
              "menu_name": "Environment Info",
              "parent_id": 18,
              "icon": null,
              "path": "environment-info",
              "can_create": true,
              "can_read": true,
              "can_update": true,
              "can_delete": true,
              "active": false,
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": 21,
      "menu_name": "Member Management",
      "parent_id": 0,
      "icon": "solar:user-bold-duotone",
      "path": "member-management",
      "can_create": true,
      "can_read": true,
      "can_update": true,
      "can_delete": true,
      "active": true,
      "children": []
    }
  ]);

  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [currentDropZone, setCurrentDropZone] = useState<DropZone | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([2, 3, 6, 9, 12, 18]));

  const toggleExpand = (id: number): void => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleActive = (id: number): void => {
    const updateMenuActive = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateMenuActive(item.children) };
        }
        return item;
      });
    };
    setMenus(updateMenuActive(menus));
  };

  // Extract menu item with its children from the tree
  const extractMenuItem = (items: MenuItem[], id: number): { item: MenuItem | null, remaining: MenuItem[] } => {
    let extractedItem: MenuItem | null = null;
    
    const remaining = items.filter(item => {
      if (item.id === id) {
        extractedItem = { ...item };
        return false;
      }
      return true;
    }).map(item => {
      if (item.children && item.children.length > 0) {
        const result = extractMenuItem(item.children, id);
        if (result.item) {
          extractedItem = result.item;
        }
        return { ...item, children: result.remaining };
      }
      return item;
    });
    
    return { item: extractedItem, remaining };
  };

  // Insert menu item at specific position
  const insertMenuItem = (
    items: MenuItem[], 
    draggedItem: MenuItem, 
    targetId: number | null, 
    position: DropPosition,
    parentId: number
  ): MenuItem[] => {
    const itemToInsert = { ...draggedItem, parent_id: parentId };
    
    if (targetId === null && position === 'inside') {
      // Insert at root level
      return [...items, itemToInsert];
    }
    
    if (position === 'before' || position === 'after') {
      const result: MenuItem[] = [];
      
      items.forEach(item => {
        if (position === 'before' && item.id === targetId) {
          result.push(itemToInsert);
        }
        
        if (item.children && item.children.length > 0) {
          const updatedChildren = insertMenuItem(item.children, draggedItem, targetId, position, item.id);
          result.push({ ...item, children: updatedChildren });
        } else {
          result.push(item);
        }
        
        if (position === 'after' && item.id === targetId) {
          result.push(itemToInsert);
        }
      });
      
      return result;
    }
    
    if (position === 'inside') {
      return items.map(item => {
        if (item.id === targetId) {
          const newChildren = [...item.children, { ...itemToInsert, parent_id: item.id }];
          return { ...item, children: newChildren };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: insertMenuItem(item.children, draggedItem, targetId, position, item.id) };
        }
        return item;
      });
    }
    
    return items;
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: MenuItem): void => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
    setCurrentDropZone(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropZone: DropZone): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || (draggedItem.id === dropZone.targetId)) {
      setDraggedItem(null);
      setCurrentDropZone(null);
      return;
    }

    // Extract the dragged item from the tree
    const { item: extractedItem, remaining } = extractMenuItem(menus, draggedItem.id);
    
    if (!extractedItem) {
      console.error('Failed to extract item');
      return;
    }

    // Insert the item at the new position
    const updated = insertMenuItem(remaining, extractedItem, dropZone.targetId, dropZone.position, dropZone.parentId);
    
    setMenus(updated);
    
    // Auto-expand parent if dropping inside
    if (dropZone.position === 'inside' && dropZone.targetId) {
      setExpandedItems(new Set([...expandedItems, dropZone.targetId]));
    }
    
    setDraggedItem(null);
    setCurrentDropZone(null);
  };

  const hasItemChanged = (item: MenuItem): boolean => {
    const originalFlat = flattenMenus(initialMenusData);
    const originalItem = originalFlat.find(orig => orig.id === item.id);
    
    if (!originalItem) return true; // New item
    
    return (
      originalItem.parent_id !== item.parent_id ||
      originalItem.menu_name !== item.menu_name ||
      originalItem.path !== item.path ||
      originalItem.icon !== item.icon ||
      originalItem.active !== item.active ||
      originalItem.can_create !== item.can_create ||
      originalItem.can_read !== item.can_read ||
      originalItem.can_update !== item.can_update ||
      originalItem.can_delete !== item.can_delete
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isLast: boolean = false, parentLines: boolean[] = []): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isDragging = draggedItem?.id === item.id;
    const hasChanged = hasItemChanged(item);

    return (
      <div key={item.id} className={`${isDragging ? 'opacity-50' : ''} relative`}>
        {/* Drop zone before item */}
        <div
          className={`h-2 transition-all ${
            currentDropZone?.targetId === item.id && currentDropZone?.position === 'before'
              ? 'bg-blue-400 h-1' 
              : 'hover:bg-blue-100'
          }`}
                        style={{ marginLeft: `${level * 24 + 32}px` }}
          onDragOver={(e) => {
            e.preventDefault();
            setCurrentDropZone({ targetId: item.id, position: 'before', parentId: item.parent_id });
          }}
          onDragLeave={() => setCurrentDropZone(null)}
          onDrop={(e) => handleDrop(e, { targetId: item.id, position: 'before', parentId: item.parent_id })}
        />
        
        {/* Menu item */}
        <div
          className={`
            flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-move relative
            ${currentDropZone?.targetId === item.id && currentDropZone?.position === 'inside' 
              ? 'bg-blue-50 border-2 border-blue-400 border-dashed' 
              : ''
            }
          `}
          style={{ paddingLeft: `${level * 24 + 32}px` }}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                e.preventDefault();
                setCurrentDropZone({ targetId: item.id, position: 'inside', parentId: item.id });
              }}
              onDragLeave={(e) => {
                e.stopPropagation();
                setCurrentDropZone(null);
              }}
              onDrop={(e) => handleDrop(e, { targetId: item.id, position: 'inside', parentId: item.id })}
            >
              <div className="flex items-center gap-3 flex-1 relative z-10 bg-transparent">
                <GripVertical className="w-5 h-5 text-gray-400" />
                
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                ) : (
                  <div className="w-6" />
                )}
                
                {item.icon && (
                  <Icon icon={item.icon} className="w-5 h-5 text-gray-600" />
                )}
                
                <span className="text-gray-700 font-medium">{item.menu_name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleActive(item.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    item.active 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-orange-600 bg-orange-50'
                  }`}
                >
                  {item.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            </div>
          </div>
          {/* Drop zone after item (only if not expanded or no children) */}
          {(!hasChildren || !isExpanded) && (
            <div
              className={`relative transition-all ${
                currentDropZone?.targetId === item.id && currentDropZone?.position === 'after'
                  ? 'h-1 bg-blue-400' 
                  : 'h-0 hover:h-2 hover:bg-blue-100'
              }`}
              style={{ marginLeft: `${level * 24 + 32}px` }}
              onDragOver={(e) => {
                e.preventDefault();
                setCurrentDropZone({ targetId: item.id, position: 'after', parentId: item.parent_id });
              }}
              onDragLeave={() => setCurrentDropZone(null)}
              onDrop={(e) => handleDrop(e, { targetId: item.id, position: 'after', parentId: item.parent_id })}
            />
          )}
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {item.children.map((child: MenuItem, index: number) => {
              const newParentLines = [...parentLines];
              if (level >= 0) {
                newParentLines[level] = index < item.children.length - 1;
              }
              return renderMenuItem(
                child, 
                level + 1, 
                index === item.children.length - 1,
                newParentLines
              );
            })}
            {/* Drop zone at end of children */}
            <div
              className={`relative transition-all ${
                currentDropZone?.targetId === item.id && 
                currentDropZone?.position === 'after' && 
                currentDropZone?.parentId === item.id
                  ? 'h-1 bg-blue-400' 
                  : 'h-0 hover:h-2 hover:bg-blue-100'
              }`}
              style={{ marginLeft: `${(level + 1) * 24 + 32}px` }}
              onDragOver={(e) => {
                e.preventDefault();
                setCurrentDropZone({ targetId: item.id, position: 'after', parentId: item.parent_id });
              }}
              onDragLeave={() => setCurrentDropZone(null)}
              onDrop={(e) => handleDrop(e, { targetId: item.id, position: 'after', parentId: item.parent_id })}
            />
          </div>
        )}
      </div>
    );
  };

  const [initialMenus] = useState<MenuItem[]>(JSON.parse(JSON.stringify(menus)));

  const flattenMenus = (items: MenuItem[], result: MenuItem[] = []): MenuItem[] => {
    items.forEach(item => {
      result.push({
        id: item.id,
        menu_name: item.menu_name,
        parent_id: item.parent_id,
        icon: item.icon,
        path: item.path,
        can_create: item.can_create,
        can_read: item.can_read,
        can_update: item.can_update,
        can_delete: item.can_delete,
        active: item.active,
        children: [] // We don't need children in flattened structure
      });
      if (item.children && item.children.length > 0) {
        flattenMenus(item.children, result);
      }
    });
    return result;
  };

  const compareMenus = (original: MenuItem[], current: MenuItem[]): any[] => {
    const originalFlat = flattenMenus(original);
    const currentFlat = flattenMenus(current);
    const changes: any[] = [];

    currentFlat.forEach(currentItem => {
      const originalItem = originalFlat.find(item => item.id === currentItem.id);
      
      if (originalItem) {
        const changedFields: any = {};
        let hasChanges = false;

        // Check each field for changes
        if (originalItem.menu_name !== currentItem.menu_name) {
          changedFields.menu_name = currentItem.menu_name;
          hasChanges = true;
        }
        if (originalItem.parent_id !== currentItem.parent_id) {
          changedFields.parent_id = currentItem.parent_id;
          hasChanges = true;
        }
        if (originalItem.path !== currentItem.path) {
          changedFields.path = currentItem.path;
          hasChanges = true;
        }
        if (originalItem.icon !== currentItem.icon) {
          changedFields.icon = currentItem.icon;
          hasChanges = true;
        }
        if (originalItem.active !== currentItem.active) {
          changedFields.active = currentItem.active;
          hasChanges = true;
        }
        if (originalItem.can_create !== currentItem.can_create) {
          changedFields.can_create = currentItem.can_create;
          hasChanges = true;
        }
        if (originalItem.can_read !== currentItem.can_read) {
          changedFields.can_read = currentItem.can_read;
          hasChanges = true;
        }
        if (originalItem.can_update !== currentItem.can_update) {
          changedFields.can_update = currentItem.can_update;
          hasChanges = true;
        }
        if (originalItem.can_delete !== currentItem.can_delete) {
          changedFields.can_delete = currentItem.can_delete;
          hasChanges = true;
        }

        if (hasChanges) {
          changes.push({
            id: currentItem.id,
            ...changedFields
          });
        }
      } else {
        // New item
        changes.push({
          id: currentItem.id,
          menu_name: currentItem.menu_name,
          parent_id: currentItem.parent_id,
          path: currentItem.path,
          icon: currentItem.icon,
          active: currentItem.active,
          can_create: currentItem.can_create,
          can_read: currentItem.can_read,
          can_update: currentItem.can_update,
          can_delete: currentItem.can_delete,
          is_new: true
        });
      }
    });

    // Check for deleted items
    originalFlat.forEach(originalItem => {
      const exists = currentFlat.find(item => item.id === originalItem.id);
      if (!exists) {
        changes.push({
          id: originalItem.id,
          is_deleted: true
        });
      }
    });

    return changes;
  };

  const exportJSON = (): void => {
    const changes = compareMenus(initialMenusData, menus);
    
    console.log("Original menus:", initialMenusData);
    console.log("Current menus:", menus);
    console.log("Changes detected:", changes);
    console.log("Example change format:", {
      "id": 21,
      "menu_name": "Member Management2",
      "path": "/member-management2", 
      "icon": "solar:buildings-bold-duotone",
      "parent_id": 2  // Changed from 0 to 2 (became child of Settings)
    });

    if (changes.length === 0) {
      alert("No changes detected");
      return;
    }

    // Categorize changes
    const updates = changes.filter(c => !c.is_new && !c.is_deleted);
    const creates = changes.filter(c => c.is_new);
    const deletes = changes.filter(c => c.is_deleted);

    const updatePayload = {
      timestamp: new Date().toISOString(),
      summary: {
        total_changes: changes.length,
        updates: updates.length,
        creates: creates.length,
        deletes: deletes.length
      },
      changes: {
        updates: updates.map(({ is_new, is_deleted, ...rest }) => rest),
        creates: creates.map(({ is_new, is_deleted, ...rest }) => rest),
        deletes: deletes.map(({ is_deleted, ...rest }) => rest)
      }
    };

    const json = JSON.stringify(updatePayload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu-updates.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Menu Reordering</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop to reorder menus. Drop on item to make it a child, drop between items to reorder.
                  <span className="inline-block ml-2 text-amber-600">● Modified items are highlighted</span>
                </p>
              </div>
              {compareMenus(initialMenusData, menus).length > 0 && (
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  {compareMenus(initialMenusData, menus).length} changes
                </div>
              )}
            </div>
          </div>
          
          <div>
            {/* Drop zone at the very top for root level */}
            <div
              className={`transition-all ${
                currentDropZone?.targetId === null && currentDropZone?.position === 'inside'
                  ? 'h-8 bg-blue-400 border-2 border-blue-400 border-dashed flex items-center justify-center' 
                  : 'h-2 hover:h-4 hover:bg-blue-100'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setCurrentDropZone({ targetId: null, position: 'inside', parentId: 0 });
              }}
              onDragLeave={() => setCurrentDropZone(null)}
              onDrop={(e) => handleDrop(e, { targetId: null, position: 'inside', parentId: 0 })}
            >
              {currentDropZone?.targetId === null && currentDropZone?.position === 'inside' && (
                <span className="text-blue-600 text-sm font-medium">Drop here to move to root level</span>
              )}
            </div>
            
            {menus.map((menu: MenuItem, index: number) => renderMenuItem(menu, 0, index === menus.length - 1, []))}
            
            {/* Drop zone at the very bottom for root level */}
            <div
              className={`transition-all ${
                currentDropZone?.targetId === -1 && currentDropZone?.position === 'inside'
                  ? 'h-8 bg-blue-400' 
                  : 'h-2 hover:h-4 hover:bg-blue-100'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setCurrentDropZone({ targetId: null, position: 'inside', parentId: 0 });
              }}
              onDragLeave={() => setCurrentDropZone(null)}
              onDrop={(e) => handleDrop(e, { targetId: null, position: 'inside', parentId: 0 })}
            />
          </div>
          
          <div className="p-6 border-t flex justify-between">
            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                Back
              </button>
              <button 
                onClick={() => {
                  if (confirm("Reset all changes and restore original menu structure?")) {
                    setMenus(JSON.parse(JSON.stringify(initialMenusData)));
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
              >
                Reset Changes
              </button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportJSON}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium"
              >
                Export Changes
              </button>
              <button 
                onClick={() => {
                  const json = JSON.stringify({ menus }, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "menu-full-structure.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                Export Full Structure
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;