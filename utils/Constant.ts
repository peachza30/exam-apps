export const MODAL_BODY_TYPES = {
  CONFIRMATION: 'CONFIRMATION',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
};
export const CONFIRMATION_MODAL_CLOSE_TYPES = {
  DELETE_USER: 'DELETE_USER',
};

export function mapMenuHierarchy(flatMenus: MenuItem[]): MenuItem[] {
  const menuMap: Record<number, MenuItem> = {};
  const roots: MenuItem[] = [];

  // Step 1: Build map of all menu items
  flatMenus.forEach(menu => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  // Step 2: Attach children to parents
  flatMenus.forEach(menu => {
    if (menu.parent_id !== 0) {
      const parent = menuMap[menu.parent_id];
      if (parent) {
        parent.children!.push(menuMap[menu.id]);
      }
    } else {
      roots.push(menuMap[menu.id]);
    }
  });

  return roots;
}

export const syncParentPermissions = (items: PermissionItem[]): PermissionItem[] => {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      const syncedChildren = syncParentPermissions(item.children);

      const aggregatedPermissions = {
        can_create: syncedChildren.some(child => child.permissions.can_create),
        can_read: syncedChildren.some(child => child.permissions.can_read),
        can_update: syncedChildren.some(child => child.permissions.can_update),
        can_delete: syncedChildren.some(child => child.permissions.can_delete)
      };

      return {
        ...item,
        permissions: {
          ...item.permissions,
          ...aggregatedPermissions
        },
        children: syncedChildren
      };
    }
    return item;
  });
};
