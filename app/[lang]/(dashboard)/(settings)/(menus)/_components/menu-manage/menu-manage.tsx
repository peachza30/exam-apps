"use client";
import React, { useState, DragEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMenuStore } from "@/store/menu/useMenuStore";
import { mapMenuHierarchy } from "@/utils/Constant";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";

const MenuManagement: React.FC = () => {
  const [originalMenus, setOriginalMenus] = useState<MenuItem[]>([]);
  const [menusList, setMenusList] = useState<MenuItem[]>([]);
  const { menus, getMenus, updateMenu, deleteMenu, setMode, isReorderMode, setIsReorderMode } = useMenuStore();
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [currentDropZone, setCurrentDropZone] = useState<DropZone | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [fetchClear, setFetchClear] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletedItems, setDeletedItems] = useState<Set<number>>(new Set());

  const router = useRouter();

  useEffect(() => {
    getMenus({
      search: search || "",
      status: statusVal || "",
    });
  }, []);

  useEffect(() => {
    if (menus.length > 0) {
      const hierarchicalMenus = mapMenuHierarchy(menus);
      const menusWithSequence = addSequenceNumbers(hierarchicalMenus);
      setMenusList(menusWithSequence);
      setOriginalMenus(menusWithSequence);
    }
  }, [menus]);

  const status: { value: string; label: string }[] = [
    { value: "", label: "--- Select Status ---" },
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];
  const currentStatusValue = status.find(opt => opt.value === statusVal)?.value || "";

  const fetchData = async (pageIndex?: number) => {
    setLoading(true);

    try {
      await getMenus({
        search: search || "",
        status: statusVal || "",
      });
      // Update metadata from API response
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchClear && search === "" && statusVal === "") {
      fetchData();
      setFetchClear(false); // reset
    }
  }, [search, statusVal, fetchClear]);

  // Add sequence numbers to menus based on their current order
  const addSequenceNumbers = (items: MenuItem[], startSequence: number = 0): MenuItem[] => {
    return items.map((item, index) => ({
      ...item,
      sequence: startSequence + index,
      children: item.children ? addSequenceNumbers(item.children, 0) : [],
    }));
  };

  // Resequence items after drag and drop
  const resequenceItems = (items: MenuItem[]): MenuItem[] => {
    return items.map((item, index) => ({
      ...item,
      sequence: index,
      children: item.children ? resequenceItems(item.children) : [],
    }));
  };

  const toggleExpand = (id: number): void => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleEdit = (item: MenuItem): void => {
    setMode("edit");
    router.push(`/manage-menus/${item.id}`);
  };

  const handleView = (item: MenuItem): void => {
    setMode("view");
    router.push(`/manage-menus/${item.id}`);
  };

  const handleDelete = (item: MenuItem): void => {
    if (item.children && item.children.length > 0) {
      alert(`Cannot delete "${item.menu_name}" because it has ${item.children.length} child menu(s). Please delete all children first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${item.menu_name}"?`)) {
      // Just mark the item as deleted, don't actually remove it yet
      setDeletedItems(prev => new Set([...prev, item.id]));
    }
  };

  // Check if item is ancestor of target
  const isAncestor = (itemId: number, targetId: number, items: MenuItem[]): boolean => {
    const findInChildren = (items: MenuItem[], targetId: number): boolean => {
      for (const item of items) {
        if (item.id === targetId) return true;
        if (item.children && findInChildren(item.children, targetId)) return true;
      }
      return false;
    };

    const findItem = (items: MenuItem[], itemId: number): MenuItem | null => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
          const found = findItem(item.children, itemId);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(items, itemId);
    if (!item) return false;

    return item.children ? findInChildren(item.children, targetId) : false;
  };

  const extractMenuItem = (items: MenuItem[], id: number): { item: MenuItem | null; remaining: MenuItem[] } => {
    let extractedItem: MenuItem | null = null;

    const remaining = items
      .filter(item => {
        if (item.id === id) {
          extractedItem = { ...item };
          return false;
        }
        return true;
      })
      .map(item => {
        if (item.children && item.children.length > 0) {
          const result = extractMenuItem(item.children, id);
          if (result.item) {
            extractedItem = result.item;
          }
          return { ...item, children: result.remaining };
        }
        return item;
      });

    return { item: extractedItem, remaining: resequenceItems(remaining) };
  };

  const insertMenuItem = (items: MenuItem[], draggedItem: MenuItem, targetId: number | null, position: DropPosition, parentId: number): MenuItem[] => {
    const itemToInsert = { ...draggedItem, parent_id: parentId };

    if (targetId === null && position === "inside") {
      // Insert at root level at the end
      const result = [...items, itemToInsert];
      return resequenceItems(result);
    }

    if (position === "before" || position === "after") {
      const result: MenuItem[] = [];
      let inserted = false;

      items.forEach(item => {
        if (position === "before" && item.id === targetId && !inserted) {
          result.push(itemToInsert);
          inserted = true;
        }

        if (item.children && item.children.length > 0) {
          const updatedChildren = insertMenuItem(item.children, draggedItem, targetId, position, item.id);
          result.push({ ...item, children: updatedChildren });
        } else {
          result.push(item);
        }

        if (position === "after" && item.id === targetId && !inserted) {
          result.push(itemToInsert);
          inserted = true;
        }
      });

      return resequenceItems(result);
    }

    if (position === "inside") {
      const result = items.map(item => {
        if (item.id === targetId) {
          const newChildren = [...(item.children || []), { ...itemToInsert, parent_id: item.id }];
          return { ...item, children: resequenceItems(newChildren) };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: insertMenuItem(item.children, draggedItem, targetId, position, item.id) };
        }
        return item;
      });
      return result;
    }

    return items;
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: MenuItem): void => {
    if (!isReorderMode) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    // Add visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>): void => {
    setDraggedItem(null);
    setCurrentDropZone(null);
    // Remove visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropZone: DropZone): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.id === dropZone.targetId) {
      setDraggedItem(null);
      setCurrentDropZone(null);
      return;
    }

    // Prevent dropping item into its own children
    if (dropZone.targetId && isAncestor(draggedItem.id, dropZone.targetId, menusList)) {
      alert("Cannot move an item into its own children!");
      setDraggedItem(null);
      setCurrentDropZone(null);
      return;
    }

    // Extract the dragged item from the tree
    const { item: extractedItem, remaining } = extractMenuItem(menusList, draggedItem.id);

    if (!extractedItem) {
      return;
    }

    // Insert the item at the new position
    const updated = insertMenuItem(remaining, extractedItem, dropZone.targetId, dropZone.position, dropZone.parentId);

    setMenusList(updated);

    // Auto-expand parent if dropping inside
    if (dropZone.position === "inside" && dropZone.targetId) {
      setExpandedItems(new Set([...expandedItems, dropZone.targetId]));
    }

    setDraggedItem(null);
    setCurrentDropZone(null);
  };

  const hasItemChanged = (item: MenuItem): boolean => {
    const findOriginalItem = (items: MenuItem[], id: number): MenuItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findOriginalItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const originalItem = findOriginalItem(originalMenus, item.id);
    if (!originalItem) return true;

    return originalItem.parent_id !== item.parent_id || originalItem.sequence !== item.sequence || originalItem.menu_name !== item.menu_name || originalItem.path !== item.path || originalItem.icon !== item.icon || originalItem.status !== item.status;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isLast: boolean = false, parentLines: boolean[] = []): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isDragging = draggedItem?.id === item.id;
    const hasChanged = hasItemChanged(item);
    const isDeleted = deletedItems.has(item.id);
    const isValidDropTarget = !draggedItem || (draggedItem.id !== item.id && !isAncestor(draggedItem.id, item.id, menusList));

    return (
      <div key={item.id} className={`${isDragging ? "opacity-50" : ""} ${isDeleted ? "opacity-30 transition-opacity duration-500" : ""} relative`}>
        {/* Vertical guide lines */}
        {level > 0 &&
          parentLines.map((drawLine, idx) =>
            drawLine ? (
              <div
                key={idx}
                className="absolute border-l-2 border-blue-50"
                style={{
                  left: `${idx * 24 + 32 + 12}px`,
                  top: 0,
                  bottom: 0,
                }}
              />
            ) : null
          )}

        {/* Drop zone before */}
        {isReorderMode && isValidDropTarget && (
          <div
            className={`transition-all duration-200 ${currentDropZone?.targetId === item.id && currentDropZone?.position === "before" ? "h-2 bg-blue-500 rounded-sm mx-2" : "h-1 hover:h-2 hover:bg-blue-200 mx-2"}`}
            style={{ marginLeft: `${level * 24 + 32}px` }}
            onDragOver={e => {
              e.preventDefault();
              if (isValidDropTarget) {
                setCurrentDropZone({ targetId: item.id, position: "before", parentId: item.parent_id });
              }
            }}
            onDragLeave={() => setCurrentDropZone(null)}
            onDrop={e => handleDrop(e, { targetId: item.id, position: "before", parentId: item.parent_id })}
          />
        )}

        {/* Menu item */}
        <div
          // hover:bg-gray-50
          className={`
            flex items-center justify-between py-3 px-4 transition-all duration-200
            ${isReorderMode ? "cursor-move hover:bg-gray-50" : "cursor-pointer hover:bg-gray-50"}
            ${currentDropZone?.targetId === item.id && currentDropZone?.position === "inside" && isValidDropTarget ? "bg-blue-50 ring-2 ring-blue-400 ring-offset-2" : ""}
            ${hasChanged && isReorderMode ? "bg-amber-50 border-l-4 border-amber-400" : ""}
            ${!isValidDropTarget && isReorderMode ? "opacity-50" : ""}
            ${isDeleted ? "pointer-events-none" : ""} 
          `}
          style={{ paddingLeft: `${level * 24 + 32}px` }}
          draggable={isReorderMode}
          onDragStart={e => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={e => {
            if (isReorderMode && isValidDropTarget) {
              e.preventDefault();
              setCurrentDropZone({ targetId: item.id, position: "inside", parentId: item.id });
            }
          }}
          onDragLeave={e => {
            e.stopPropagation();
            setCurrentDropZone(null);
          }}
          onDrop={e => isReorderMode && handleDrop(e, { targetId: item.id, position: "inside", parentId: item.id })}
          onClick={() => !isReorderMode && hasChildren && toggleExpand(item.id)}
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Drag handle */}
            {isReorderMode && <Icon icon="material-symbols:drag-indicator" className="w-5 h-5 text-gray-400 hover:text-gray-600" />}

            {/* Expand/Collapse button */}
            {hasChildren ? (
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? <Icon icon="solar:alt-arrow-down-line-duotone" className="w-4 h-4 text-gray-600" /> : <Icon icon="solar:alt-arrow-right-line-duotone" className="w-4 h-4 text-gray-600" />}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {/* Menu icon */}
            {item.icon && <Icon icon={item.icon} className="w-5 h-5 text-gray-600" />}

            {/* Menu name */}
            <span className="text-gray-700 font-medium">{item.menu_name}</span>

            {/* Sequence number in reorder mode */}
            {isReorderMode && item.sequence !== undefined && <span className="text-xs text-gray-400 ml-2">#{item.sequence + 1}</span>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <span
              className={`
              ml-2 px-2 py-0.5 text-xs font-semibold rounded
              ${item.status === "A" ? "text-green-600 bg-green-50" : "text-orange-600 bg-orange-50"}
            `}
            >
              {item.status === "A" ? "ACTIVE" : "INACTIVE"}
            </span>

            {!isReorderMode && (
              <>
                <Button
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  color="warning"
                  variant="soft"
                >
                  <Icon icon="hugeicons:pencil-edit-01" width="20" height="20" />
                </Button>
                <Button
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    handleView(item);
                    setMode("view");
                    // router.push(`/manage-menus/${menus.id || 0}`);
                  }}
                  color="info"
                  variant="soft"
                >
                  <Icon icon="fluent:eye-24-filled" width="20" height="20" />
                </Button>
                <Button
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(item);
                    setOpenModal(true);
                  }}
                  color="destructive"
                  variant="soft"
                  title={item.children && item.children.length > 0 ? "Cannot delete parent with children" : "Delete"}
                  disabled={item.children && item.children.length > 0}
                >
                  <Icon icon="hugeicons:delete-02" width="20" height="20" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Drop zone after (if no expanded children) */}
        {isReorderMode && (!hasChildren || !isExpanded) && isValidDropTarget && (
          <div
            className={`transition-all duration-200 ${currentDropZone?.targetId === item.id && currentDropZone?.position === "after" ? "h-2 bg-blue-500 rounded-sm mx-2" : "h-1 hover:h-2 hover:bg-blue-200 mx-2"}`}
            style={{ marginLeft: `${level * 24 + 32}px` }}
            onDragOver={e => {
              e.preventDefault();
              if (isValidDropTarget) {
                setCurrentDropZone({ targetId: item.id, position: "after", parentId: item.parent_id });
              }
            }}
            onDragLeave={() => setCurrentDropZone(null)}
            onDrop={e => handleDrop(e, { targetId: item.id, position: "after", parentId: item.parent_id })}
          />
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {item.children.map((child: MenuItem, index: number) => {
              const newParentLines = [...parentLines];
              if (level >= 0) {
                newParentLines[level] = index < item.children.length - 1;
              }
              return renderMenuItem(child, level + 1, index === item.children.length - 1, newParentLines);
            })}
            {/* Drop zone at end of children */}
            {isReorderMode && isValidDropTarget && (
              <div
                className={`transition-all duration-200 ${currentDropZone?.targetId === item.id && currentDropZone?.position === "after" && currentDropZone?.parentId === item.id ? "h-2 bg-blue-500 rounded-sm mx-2" : "h-1 hover:h-2 hover:bg-blue-200 mx-2"}`}
                style={{ marginLeft: `${(level + 1) * 24 + 32}px` }}
                onDragOver={e => {
                  e.preventDefault();
                  if (isValidDropTarget) {
                    setCurrentDropZone({ targetId: item.id, position: "after", parentId: item.parent_id });
                  }
                }}
                onDragLeave={() => setCurrentDropZone(null)}
                onDrop={e => handleDrop(e, { targetId: item.id, position: "after", parentId: item.parent_id })}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const flattenMenus = (items: MenuItem[], result: MenuItem[] = []): MenuItem[] => {
    items.forEach(item => {
      result.push({
        ...item,
        children: [],
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

        // Check for all field changes including sequence
        const fieldsToCheck = ["menu_name", "parent_id", "path", "icon", "status", "can_create", "can_read", "can_update", "can_delete", "sequence"];

        fieldsToCheck.forEach(field => {
          if (originalItem[field] !== currentItem[field]) {
            changedFields[field] = currentItem[field];
            hasChanges = true;
          }
        });

        if (hasChanges) {
          changes.push({
            id: currentItem.id,
            menu_name: currentItem.menu_name, // Always include menu_name for identification
            ...changedFields,
          });
        }
      } else {
        // New item
        changes.push({
          ...currentItem,
          is_new: true,
        });
      }
    });

    // Check for deleted items
    originalFlat.forEach(originalItem => {
      const exists = currentFlat.find(item => item.id === originalItem.id);
      if (!exists) {
        changes.push({
          id: originalItem.id,
          menu_name: originalItem.menu_name, // Include menu_name for deleted items too
          is_deleted: true,
        });
      }
    });

    return changes;
  };

  const exportJSON = (): void => {
    const changes = compareMenus(originalMenus, menusList);

    if (changes.length === 0) {
      alert("No changes detected");
      return;
    }

    const updates = changes.filter(c => !c.is_new && !c.is_deleted);
    const creates = changes.filter(c => c.is_new);
    const deletes = changes.filter(c => c.is_deleted);

    const updatePayload = {
      timestamp: new Date().toISOString(),
      summary: {
        total_changes: changes.length,
        updates: updates.length,
        creates: creates.length,
        deletes: deletes.length,
      },
      changes: {
        updates: updates.map(({ is_new, is_deleted, ...rest }) => rest),
        creates: creates.map(({ is_new, is_deleted, ...rest }) => rest),
        deletes: deletes.map(({ is_deleted, ...rest }) => rest),
      },
      full_structure: menusList, // Include full structure for reference
    };

    console.log("Export payload example:", {
      updates_example: updates[0]
        ? {
            id: updates[0].id,
            menu_name: updates[0].menu_name, // Always included for identification
            parent_id: updates[0].parent_id,
            sequence: updates[0].sequence,
            // ... other changed fields
          }
        : null,
    });

    const json = JSON.stringify(updatePayload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `menu-updates-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetMenu = () => {
    if (confirm("Reset all changes and restore original menu structure?")) {
      setMenusList(JSON.parse(JSON.stringify(originalMenus))); // Deep clone
      setDeletedItems(new Set()); // Clear deleted items
    }
  };

  const saveChanges = async () => {
    // First, remove all deleted items from menusList
    const removeDeletedItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (deletedItems.has(item.id)) {
          return false;
        }
        if (item.children && item.children.length > 0) {
          item.children = removeDeletedItems(item.children);
        }
        return true;
      });
    };

    // Apply deletions to get final menu structure
    const finalMenusList = removeDeletedItems(menusList);

    // Compare with original to get all changes
    const changes = compareMenus(originalMenus, finalMenusList);

    if (changes.length === 0) {
      alert("No changes to save");
      return;
    }

    const updates = changes.filter(c => !c.is_new && !c.is_deleted);
    const creates = changes.filter(c => c.is_new);
    const deletes = changes.filter(c => c.is_deleted);

    let confirmMessage = `You are about to save ${changes.length} changes:\n\n`;

    if (updates.length > 0) {
      confirmMessage += `Updated (${updates.length}):\n`;
      updates.forEach(item => {
        confirmMessage += `  • ${item.menu_name}\n`;
      });
    }

    if (creates.length > 0) {
      confirmMessage += `\nCreated (${creates.length}):\n`;
      creates.forEach(item => {
        confirmMessage += `  • ${item.menu_name}\n`;
      });
    }

    if (deletes.length > 0) {
      confirmMessage += `\nDeleted (${deletes.length}):\n`;
      deletes.forEach(item => {
        confirmMessage += `  • ${item.menu_name}\n`;
      });
    }

    confirmMessage += "\nDo you want to continue?";

    if (!confirm(confirmMessage)) {
      return;
    }

    // Update the API calls
    await Promise.all(changes.map(item => updateMenu(item.id, item)));

    console.log("changes", changes);

    // Update state after successful save
    setMenusList(finalMenusList);
    setOriginalMenus(JSON.parse(JSON.stringify(finalMenusList)));
    setDeletedItems(new Set()); // Clear deleted items
    setIsReorderMode(false);
  };

  const handleClear = () => {
    setSearch("");
    setStatusVal("");
    setFetchClear(true);
  };

  return (
    <div className="">
      {/* <div className="p-1 md:p-5 grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center text-default-900"> */}
      {/* <p className="">Status</p> */}
      {/* <div className=""> */}
      {/* <Select
            value={currentStatusValue}
            onValueChange={(newValue: string) => {
              setStatusVal(newValue);
            }}
          > */}
      {/* <SelectTrigger> */}
      {/* <SelectValue placeholder="--All--" /> */}
      {/* </SelectTrigger> */}
      {/* <SelectContent> */}
      {/* {status.map(opt => ( */}
      {/* <SelectItem key={opt.value} value={opt.value} disabled={opt.value === ""}> */}
      {/* {opt.label} */}
      {/* </SelectItem> */}
      {/* ))} */}
      {/* </SelectContent> */}
      {/* </Select> */}
      {/* </div> */}
      {/* <InputGroup merged> */}
      {/* <InputGroupText><Icon icon="heroicons:magnifying-glass" /></InputGroupText> */}
      {/* <Input
            type="text"
            placeholder="Search.."
            value={search}
            onChange={search => {
              setSearch(search.target.value);
            }}
          /> */}
      {/* </InputGroup> */}
      {/* <div className="space-x-4"> */}
      {/* <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              fetchData();
            }}
          > */}
      {/* <Icon icon="mingcute:search-line" width="24" height="24" />
            Search
          </Button>{" "} */}
      {/* 128px */}
      {/* <Button
            variant="outline"
            className="w-32"
            onClick={() => {
              handleClear();
            }}
          > */}
      {/* <Icon icon="solar:refresh-line-duotone" width="24" height="24" />
            Clear
          </Button>{" "} */}
      {/* </div> */}
      {/* </div> */}
      <div className="flex items-center gap-4">
        {!isReorderMode && (
          <Button onClick={() => setIsReorderMode(true)} variant="soft" color="default">
            <Icon icon="material-symbols:drag-indicator" className="w-5 h-5 mr-2" />
            Reorder Mode
          </Button>
        )}
        {isReorderMode && (
          <>
            {compareMenus(originalMenus, menusList).length + deletedItems.size > 0 && <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{compareMenus(originalMenus, menusList).length + deletedItems.size} changes</div>}
            <Button onClick={resetMenu} variant="soft" color="destructive">
              Reset Changes
            </Button>
            {/* <Button onClick={exportJSON} variant="soft">
              Export Changes
            </Button> */}
          </>
        )}
      </div>

      <div className="p-6">
        {/* Root level drop zone */}
        {isReorderMode && (
          <div
            className={`transition-all duration-200 mb-2 ${currentDropZone?.targetId === null && currentDropZone?.position === "inside" ? "h-16 bg-blue-100 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center" : "h-4 hover:h-8 hover:bg-blue-50 rounded-lg"}`}
            onDragOver={e => {
              e.preventDefault();
              setCurrentDropZone({ targetId: null, position: "inside", parentId: 0 });
            }}
            onDragLeave={() => setCurrentDropZone(null)}
            onDrop={e => handleDrop(e, { targetId: null, position: "inside", parentId: 0 })}
          >
            {currentDropZone?.targetId === null && currentDropZone?.position === "inside" && <span className="text-blue-600 font-medium">Drop here to move to root level</span>}
          </div>
        )}

        {/* Menu items */}
        <div className="space-y-1">{menusList.map((menu: MenuItem, index: number) => renderMenuItem(menu, 0, index === menusList.length - 1, []))}</div>

        {/* Empty state */}
        {menusList.length === 0 && <div className="text-center py-12 text-gray-500">No menus found. Create your first menu to get started.</div>}
      </div>

      {/* Footer actions */}
      <div className="p-6 flex justify-between">
        {isReorderMode && (
          <Button
            color="secondary"
            variant="outline"
            onClick={() => {
              if (!isReorderMode) {
                router.push("/dashboard");
              } else {
                setIsReorderMode(false);
              }
            }}
          >
            Back
          </Button>
        )}
        {isReorderMode && (
          <Button onClick={saveChanges} disabled={compareMenus(originalMenus, menusList).length === 0}>
            Save Changes ({compareMenus(originalMenus, menusList).length + deletedItems.size})
          </Button>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
