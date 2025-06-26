// Helper to build the correct nested structure from flat API data
function buildNestedMenuStructure(menus: ApiMenu[]): ApiMenu[] {
  const menuMap = new Map<number, ApiMenu>();
  const rootMenus: ApiMenu[] = [];

  // First pass: create a map of all menus
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // Second pass: build the tree structure
  menus.forEach(menu => {
    const menuItem = menuMap.get(menu.id)!;
    if (menu.parent_id === 0) {
      rootMenus.push(menuItem);
    } else {
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        parent.children?.push(menuItem);
      }
    }
  });

  return rootMenus;
}

// Transform function
export function transformApiMenuToConfig(apiUsers: ApiUser[] | ApiUser): MenusConfig {
  const normalizedUsers = Array.isArray(apiUsers) ? apiUsers : [apiUsers];
  const userMenus = (normalizedUsers[0]?.role as ApiRole)?.menus || [];

  const nestedMenus = userMenus[0]?.children ? filterActiveMenus(userMenus) : buildNestedMenuStructure(filterActiveMenus(userMenus));

  function filterActiveMenus(menuItems: ApiMenu[]): ApiMenu[] {
    return menuItems
      .filter(menu => menu.status === "A")
      .map(menu => ({
        ...menu,
        children: menu.children ? filterActiveMenus(menu.children) : []
      }));
  }
  function transformMenuModern(menu: ApiMenu, depth: number = 0): MenuItemProps {
    // Check if menu has children to determine href
    const hasChildren = menu.children && menu.children.length > 0;

    const menuItem: MenuItemProps = {
      title: menu.menu_name,
      icon: menu.icon,
      // Set href to empty string if menu has children, otherwise use the path
      href: hasChildren ? "" : (menu.path && menu.path !== '#' ? `/${menu.path.replace(/^\//, '')}` : '#')
    };

    if (hasChildren) {
      if (depth === 0) {
        menuItem.child = menu.children?.map(child => transformMenuModern(child, depth + 1));
      } else if (depth === 1) {
        menuItem.nested = menu.children?.map(child => transformMenuModern(child, depth + 1));
      } else {
        menuItem.child = menu.children?.map(child => transformMenuModern(child, depth + 1));
      }
    }

    return menuItem;
  }

  function transformMenuClassic(menu: ApiMenu, depth: number = 0): MenuItemProps {
    // Check if menu has children to determine href
    const hasChildren = menu.children && menu.children.length > 0;

    const menuItem: MenuItemProps = {
      title: menu.menu_name,
      icon: menu.icon,
      // Set href to empty string if menu has children, otherwise use the path
      href: hasChildren ? "" : (menu.path && menu.path !== '#' ? `/${menu.path.replace(/^\//, '')}` : '#')
    };

    if (hasChildren) {
      if (depth <= 1) {
        menuItem.child = menu.children?.map(child => transformMenuClassic(child, depth + 1));
      } else if (depth === 2) {
        menuItem.multi_menu = menu.children?.map(child => transformMenuClassic(child, depth + 1));
      } else {
        menuItem.child = menu.children?.map(child => transformMenuClassic(child, depth + 1));
      }
    }

    return menuItem;
  }

  const modernMenus = nestedMenus
    .filter(menu => menu.parent_id === 0)
    .map(menu => transformMenuModern(menu));

  const createClassicNav = (): MenuItemProps[] => {
    const classicItems: MenuItemProps[] = [];

    modernMenus.forEach(menu => {
      classicItems.push({
        isHeader: true,
        title: menu.title.toLowerCase()
      });

      const classicMenu: MenuItemProps = {
        ...menu,
        // Keep the href as is (already handled in transformation)
        href: menu.href || ""
      };

      if (menu.child && menu.child.length > 0) {
        classicMenu.child = menu.child.map(child => {
          const classicChild: MenuItemProps = {
            ...child,
            // Keep the href as is (already handled in transformation)
            href: child.href || ""
          };

          if (child.nested && child.nested.length > 0) {
            classicChild.multi_menu = child.nested;
            delete classicChild.nested;
          }

          return classicChild;
        });
      }

      classicItems.push(classicMenu);
    });

    return classicItems;
  };

  return {
    mainNav: modernMenus,
    sidebarNav: {
      modern: modernMenus,
      classic: createClassicNav()
    }
  };
}

// Usage example
export function getMenusConfig(apiData: ApiUser): MenusConfig {
  const config = transformApiMenuToConfig(apiData);
  return config;
}

// Helper function to find menu by path
export function findMenuByPath(menus: MenuItemProps[], path: string): MenuItemProps | null {
  for (const menu of menus) {
    if (menu.href === path) {
      return menu;
    }

    if (menu.child) {
      const found = findMenuByPath(menu.child, path);
      if (found) return found;
    }

    if (menu.megaMenu) {
      for (const mega of menu.megaMenu) {
        if (mega.child) {
          const found = findMenuByPath(mega.child, path);
          if (found) return found;
        }
      }
    }

    if (menu.multi_menu) {
      const found = findMenuByPath(menu.multi_menu, path);
      if (found) return found;
    }

    if (menu.nested) {
      const found = findMenuByPath(menu.nested, path);
      if (found) return found;
    }
  }

  return null;
}

// Helper function to check permissions
export function hasPermission(menu: ApiMenu, action: 'create' | 'read' | 'update' | 'delete'): boolean {
  switch (action) {
    case 'create': return menu.can_create;
    case 'read': return menu.can_read;
    case 'update': return menu.can_update;
    case 'delete': return menu.can_delete;
    default: return false;
  }
}

// Debug helper to check menu structure
export function debugMenuStructure(menus: MenuItemProps[], level: number = 0): void {
  const indent = '  '.repeat(level);
  menus.forEach(menu => {
    if (menu.isHeader) {
      console.log(`${indent}[HEADER] ${menu.title}`);
    } else {
      console.log(`${indent}${menu.title} - href: ${menu.href || 'empty'}`);
    }
    if (menu.child) {
      console.log(`${indent}  child:`);
      debugMenuStructure(menu.child, level + 2);
    }
    if (menu.nested) {
      console.log(`${indent}  nested:`);
      debugMenuStructure(menu.nested, level + 2);
    }
    if (menu.multi_menu) {
      console.log(`${indent}  multi_menu:`);
      debugMenuStructure(menu.multi_menu, level + 2);
    }
  });
}

// Complete example with actual implementation
export function createMenusConfig(apiData: ApiUser): MenusConfig {
  const menusConfig = getMenusConfig(apiData);

  // Debug output to verify structure
  console.log('=== MODERN MENU STRUCTURE ===');
  menusConfig.sidebarNav.modern.forEach((menu, index) => {
    console.log(`[${index}] ${menu.title}:`, {
      href: menu.href,
      hasChild: !!menu.child,
      childCount: menu.child?.length || 0
    });
  });

  return menusConfig;
}

// Main export function
export function getMenu(apiData: ApiUser): MenusConfig {
  return getMenusConfig(apiData);
}