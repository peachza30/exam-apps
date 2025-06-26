import { user } from '@/app/api/user/data';
// stores/roleStore.ts
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as roles from "@/services/roles/roles.service"
import * as users from "@/services/users/users.service"
import * as service from "@/services/services/service.service"
import * as menus from "@/services/menus/menus.service"
import { syncParentPermissions } from '@/utils/Constant';

/**
 * Map API services to permission items format
 */

const mapServicesToPermissionItems = (services: ApiService[]): PermissionItem[] => {
  return services.map(service => ({
    id: service.id,
    name: service.service_name.toUpperCase(),
    permissions: {
      can_create: false, // Start with false for new role creation
      can_read: false,
      can_update: false,
      can_delete: false
    },
    isExpanded: false
  }));
};

const buildMenuHierarchy = (menus: ApiMenu[]): ApiMenu[] => {
  // Create a map for quick lookup
  const menuMap = new Map<number, ApiMenu>();
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  const rootMenus: ApiMenu[] = [];

  // Build the hierarchy
  menus.forEach(menu => {
    const menuWithChildren = menuMap.get(menu.id)!;

    if (menu.parent_id === 0) {
      // Root level menu
      rootMenus.push(menuWithChildren);
    } else if (menu.parent_id === menu.id) {
      // Handle edge case where menu points to itself - treat as root
      // console.warn(`Menu ${menu.menu_name} (ID: ${menu.id}) has parent_id equal to its own id. Treating as root.`);
      rootMenus.push(menuWithChildren);
    } else {
      // Find parent and add as child
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuWithChildren);
      } else {
        // If parent not found, treat as root
        // console.warn(`Parent menu with ID ${menu.parent_id} not found for menu ${menu.menu_name} (ID: ${menu.id}). Treating as root.`);
        rootMenus.push(menuWithChildren);
      }
    }
  });

  // Sort menus by sequence at each level
  const sortBySequence = (items: ApiMenu[]) => {
    items.sort((a, b) => a.sequence - b.sequence);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortBySequence(item.children);
      }
    });
  };

  sortBySequence(rootMenus);

  return rootMenus;
};

const mapMenusToPermissionItems = (menus: ApiMenu[]): PermissionItem[] => {
  // First build the hierarchy from flat array
  const hierarchicalMenus = buildMenuHierarchy(menus);

  // Then map to PermissionItem structure
  const mapRecursive = (menuItems: ApiMenu[]): PermissionItem[] => {
    return menuItems.map(menu => ({
      id: menu.id,
      name: menu.menu_name,
      permissions: {
        can_create: false, // Start with false for new role creation
        can_read: false,
        can_update: false,
        can_delete: false
      },
      isExpanded: false, // You can set this to true if you want menus expanded by default
      ...(menu.children && menu.children.length > 0 ? {
        children: mapRecursive(menu.children)
      } : {})
    }));
  };

  return mapRecursive(hierarchicalMenus);
};
const mapMenusToPermissionItemsWithExpanded = (menus: ApiMenu[], expandedIds: number[] = []): PermissionItem[] => {
  const hierarchicalMenus = buildMenuHierarchy(menus);

  const mapRecursive = (menuItems: ApiMenu[]): PermissionItem[] => {
    return menuItems.map(menu => ({
      id: menu.id,
      name: menu.menu_name,
      permissions: {
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false
      },
      isExpanded: expandedIds.includes(menu.id), // Expand if ID is in the list
      ...(menu.children && menu.children.length > 0 ? {
        children: mapRecursive(menu.children)
      } : {})
    }));
  };

  return mapRecursive(hierarchicalMenus);
};
const mapMenusToPermissionItemsAutoExpanded = (menus: ApiMenu[]): PermissionItem[] => {
  const hierarchicalMenus = buildMenuHierarchy(menus);

  const mapRecursive = (menuItems: ApiMenu[]): PermissionItem[] => {
    return menuItems.map(menu => ({
      id: menu.id,
      name: menu.menu_name,
      permissions: {
        can_create: false,
        can_read: false,
        can_update: false,
        can_delete: false
      },
      isExpanded: menu.children && menu.children.length > 0, // Auto-expand if has children
      ...(menu.children && menu.children.length > 0 ? {
        children: mapRecursive(menu.children)
      } : {})
    }));
  };

  return mapRecursive(hierarchicalMenus);
};
/**
 * Transform API menus to MenuItemProps format
 */
const transformMenusToMenuItems = (menus: ApiMenu[]): MenuItemProps[] => {
  const transformRecursive = (menuItems: ApiMenu[]): MenuItemProps[] => {
    return menuItems
      .filter(menu => menu.can_read)
      .map(menu => ({
        title: menu.menu_name,
        icon: menu.icon,
        href: menu.path && menu.path !== '#' ? menu.path : undefined,
        path: menu.path,
        ...(menu.children && menu.children.length > 0 ? {
          child: transformRecursive(menu.children)
        } : {})
      }));
  };

  return transformRecursive(menus);
};

const initialFormData: RoleFormData = {
  role_name: '',
  role_description: '',
  scope_id: null,
  status_active: true,
  services: [],
  menus: []
};

const getInitialPermissionItems = () => ({
  services: [] as PermissionItem[],
  menus: [] as PermissionItem[]
});

export const useRoleStore = create<RoleStore>()(
  persist(

    subscribeWithSelector(
      (set, get) => ({
        formData: initialFormData,
        permissionItems: getInitialPermissionItems(),
        originalPermissionItems: getInitialPermissionItems(),
        roles: [],
        roleScopes: {},
        scopes: null,
        roleScope: null,
        role: null,
        mode: null,
        metadata: null,
        loading: false,
        error: null,

        setMode: (mode) => set({ mode }),
        fetchRoles: async (params) => {
          set({ loading: true, error: null });
          try {
            const res = await roles.findAll(params);
            set({ roles: res.data, metadata: res.metadata, loading: false });
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        fetchRolesScope: async (scope) => {
          const { roleScopes } = get();
          if (roleScopes[scope]) return;
          set({ loading: true, error: null });
          try {
            const res = await roles.findScope(scope);
            set((state) => ({
              roleScope: res.data,
              roleScopes: {
                ...state.roleScopes,
                [scope]: res.data.scope_name, // or res.data.name, depending on API
              },
              loading: false,
              // metadata: res.metadata
            }));
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        fetchScope: async () => {
          set({ loading: true, error: null });
          try {
            const res = await roles.findAllScope();
            set({ scopes: res.data, metadata: res.metadata, loading: false });
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        fetchRole: async (id: number) => {
          set({ loading: true, error: null });
          try {
            const res = await roles.findOne(id);
            set({ role: res, loading: false });
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        createRole: async (data) => {
          set({ loading: true, error: null });
          try {
            await roles.create(data);
            set({ loading: false });
            // Optionally refresh roles list
            await get().fetchRoles();
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        updateRole: async (id, data, params) => {
          set({ loading: true, error: null });
          try {
            await roles.update(id, data);
            set({ loading: false });
            // Optionally refresh roles list
            if (params) {
              await get().fetchRoles(params);
            }
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },

        deleteRole: async (id, params) => {
          set({ loading: true, error: null });
          try {
            await roles.remove(id);
            set({ loading: false });
            if (params) {
              await get().fetchRoles(params);
            }
          } catch (err) {
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "An unexpected error occurred", loading: false });
            }
          }
        },
        initializeServices: async () => {
          try {
            const res = await service.findAll({});
            const servicesData = Array.isArray(res) ? res : res.data || [];
            const mappedServices = mapServicesToPermissionItems(servicesData);
            const clonedServices = JSON.parse(JSON.stringify(mappedServices));

            set((state) => ({
              permissionItems: {
                ...state.permissionItems,
                services: mappedServices
              },
              originalPermissionItems: {
                ...state.originalPermissionItems,
                services: clonedServices
              }
            }));
          } catch (err) {
            console.error('Error initializing services:', err);
            if (err instanceof Error) {
              set({ error: err.message });
            } else {
              set({ error: "Failed to load services" });
            }
          }
        },
        initializeMenus: async () => {
          try {
            const res = await menus.findAll({});
            const menusData = Array.isArray(res) ? res : res.data || [];
            const mappedMenus = mapMenusToPermissionItems(menusData);

            const clonedMenus = JSON.parse(JSON.stringify(mappedMenus));


            set((state) => ({
              permissionItems: {
                ...state.permissionItems,
                menus: mappedMenus
              },
              originalPermissionItems: {
                ...state.originalPermissionItems,
                menus: clonedMenus
              }
            }));
          } catch (err) {
            console.error('Error initializing menus:', err);
            if (err instanceof Error) {
              set({ error: err.message });
            } else {
              set({ error: "Failed to load menus" });
            }
          }
        },
        initializeAll: async () => {
          set({ loading: true, error: null });
          try {
            await Promise.all([
              get().initializeServices(),
              get().initializeMenus()
            ]);
            set({ loading: false });
          } catch (err) {
            console.error('Error initializing data:', err);
            set({ loading: false });
          }
        },
        loadRoleData: async (roleId: number) => {
          set({ loading: true, error: null });
          try {
            // First initialize services and menus
            await get().initializeAll();

            // Then fetch the specific role
            const roleRes = await roles.findOne(roleId);
            const roleData: RoleScope = roleRes.data || roleRes;

            // Update form data
            set((state) => ({
              formData: {
                ...state.formData,
                role_name: roleData.role_name,
                scope_id: roleData.scope_id,
                services: roleData.services,
                menus: roleData.menus
              },
              role: roleData,
              loading: false
            }));

            // Apply role permissions to permission items
            const state = get();

            // Convert MenuItem[] to PermissionItem[] format for applying permissions
            const convertMenuItemsToPermissionItems = (menuItems: MenuItem[]): PermissionItem[] => {
              return menuItems.map(menuItem => ({
                id: menuItem.id,
                name: menuItem.menu_name,
                permissions: {
                  can_create: menuItem.can_create,
                  can_read: menuItem.can_read,
                  can_update: menuItem.can_update,
                  can_delete: menuItem.can_delete
                },
                isExpanded: false,
                children: menuItem.children ? convertMenuItemsToPermissionItems(menuItem.children) : []
              }));
            };
            const convertServiceItemsToPermissionItems = (serviceItems: ServicePermission[]): PermissionItem[] => {
              return serviceItems.map(serviceItem => ({
                id: serviceItem.id,
                name: serviceItem.service_name,
                permissions: {
                  can_create: serviceItem.can_create,
                  can_read: serviceItem.can_read,
                  can_update: serviceItem.can_update,
                  can_delete: serviceItem.can_delete
                },
                isExpanded: false,
                // children: serviceItem.children ? convertServiceItemsToPermissionItems(menuItem.children) : []
              }));
            };

            const updatedServices = applyRolePermissionsToItems(
              state.permissionItems.services,
              roleData.services,
              'service'
            );
            console.log("Original services:", state.permissionItems.services);
            console.log("Role menu permissions:", convertServiceItemsToPermissionItems(roleData.services));
            console.log("Updated services result:", updatedServices);

            const updatedMenus = applyRolePermissionsToItems(
              state.permissionItems.menus,
              convertMenuItemsToPermissionItems(roleData.menus),
              'menu'
            );


            set((state) => ({
              permissionItems: {
                services: updatedServices,
                menus: updatedMenus
              }
            }));

          } catch (err) {
            console.error('Error loading role data:', err);
            if (err instanceof Error) {
              set({ error: err.message, loading: false });
            } else {
              set({ error: "Failed to load role data", loading: false });
            }
          }
        },
        // Get menu configuration for navigation
        getMenuConfig: (): MenuItemProps[] => {
          const state = get();
          const readableMenus = state.permissionItems.menus.filter(menu =>
            menu.permissions.can_read
          );

          // Convert PermissionItem[] to ApiMenu[] format for transformation
          const apiMenus: ApiMenu[] = readableMenus.map(item => ({
            id: item.id,
            menu_name: item.name,
            parent_id: 0,
            icon: '',
            path: '',
            can_create: item.permissions.can_create,
            can_read: item.permissions.can_read,
            can_update: item.permissions.can_update,
            can_delete: item.permissions.can_delete,
            children: item.children ? item.children.map(child => ({
              id: child.id,
              menu_name: child.name,
              parent_id: item.id,
              icon: '',
              path: '',
              can_create: child.permissions.can_create,
              can_read: child.permissions.can_read,
              can_update: child.permissions.can_update,
              can_delete: child.permissions.can_delete,
              children: []
            })) : []
          }));

          return transformMenusToMenuItems(apiMenus);
        },
        setRoleName: (name) => set((state) => ({
          formData: { ...state.formData, role_name: name }
        })),
        setRoleDescription: (description) => set((state) => ({
          formData: { ...state.formData, role_description: description }
        })),
        setScopeId: (id) => set((state) => ({
          formData: { ...state.formData, scope_id: id }
        })),
        setStatusActive: (active) => set((state) => ({
          formData: { ...state.formData, status_active: active }
        })),
        togglePermission: (category, itemId, permissionType) => {
          console.log(`🔧 Toggle Permission: Category=${category}, ItemId=${itemId}, Permission=${permissionType}`);

          set((state) => {
            const togglePermissionRecursively = (item: PermissionItem, shouldCheck: boolean): PermissionItem => {
              const updatedItem = {
                ...item,
                permissions: {
                  ...item.permissions,
                  [permissionType]: shouldCheck
                }
              };

              if (item.children && item.children.length > 0) {
                updatedItem.children = item.children.map(child =>
                  togglePermissionRecursively(child, shouldCheck)
                );
              }

              return updatedItem;
            };

            const updatePermission = (items: PermissionItem[]): PermissionItem[] => {
              return items.map(item => {
                if (item.id === itemId) {
                  const shouldCheck = !item.permissions[permissionType];
                  console.log(`✅ Found target item: ${item.name} (ID: ${item.id})`);
                  console.log(`   ${permissionType} before: ${item.permissions[permissionType]}, after: ${shouldCheck}`);

                  return togglePermissionRecursively(item, shouldCheck);
                }

                if (item.children && item.children.length > 0) {
                  return {
                    ...item,
                    children: updatePermission(item.children)
                  };
                }

                return item;
              });
            };

            return {
              permissionItems: {
                ...state.permissionItems,
                [category]: syncParentPermissions(updatePermission(state.permissionItems[category]))
              }
            };
          });
        },
        toggleAllPermissions: (category, itemId) => {
          console.log(`🔧 Toggle All Permissions: Category=${category}, ItemId=${itemId}`);

          set((state) => {
            const togglePermissionsRecursively = (item: PermissionItem, shouldCheck: boolean): PermissionItem => {
              const updatedItem = {
                ...item,
                permissions: {
                  can_create: shouldCheck,
                  can_read: shouldCheck,
                  can_update: shouldCheck,
                  can_delete: shouldCheck
                }
              };

              if (item.children && item.children.length > 0) {
                updatedItem.children = item.children.map(child =>
                  togglePermissionsRecursively(child, shouldCheck)
                );
              }

              return updatedItem;
            };

            const updateAllPermissions = (items: PermissionItem[]): PermissionItem[] => {
              return items.map(item => {
                if (item.id === itemId) {
                  const allChecked = item.permissions.can_create &&
                    item.permissions.can_read &&
                    item.permissions.can_update &&
                    item.permissions.can_delete;

                  const shouldCheck = !allChecked;
                  console.log(`✅ Found target item: ${item.name} (ID: ${item.id})`);
                  console.log(`   All currently checked: ${allChecked}`);
                  console.log(`   Will set all to: ${shouldCheck}`);

                  return togglePermissionsRecursively(item, shouldCheck);
                }

                if (item.children && item.children.length > 0) {
                  return {
                    ...item,
                    children: updateAllPermissions(item.children)
                  };
                }

                return item;
              });
            };

            return {
              permissionItems: {
                ...state.permissionItems,
                [category]: syncParentPermissions(updateAllPermissions(state.permissionItems[category]))
              }
            };
          });
        },
        toggleExpanded: (category, itemId) => {
          set((state) => {
            const updateExpanded = (items: PermissionItem[]): PermissionItem[] => {
              return items.map(item => {
                if (item.id === itemId) {
                  return { ...item, isExpanded: !item.isExpanded };
                }

                if (item.children && item.children.length > 0) {
                  return {
                    ...item,
                    children: updateExpanded(item.children)
                  };
                }

                return item;
              });
            };

            return {
              permissionItems: {
                ...state.permissionItems,
                [category]: updateExpanded(state.permissionItems[category])
              }
            };
          });
        },
        submitRole: async () => {
          const state = get();

          const services: ServicePermission[] = [];
          const menus: MenusPermission[] = [];

          const compareAndCollect = (
            currentItems: PermissionItem[],
            originalItems: PermissionItem[],
            collector: (item: PermissionItem, isService: boolean) => void,
            isService: boolean
          ) => {
            const findOriginalById = (id: number, items: PermissionItem[]): PermissionItem | undefined => {
              for (const item of items) {
                if (item.id === id) return item;
                if (item.children) {
                  const found = findOriginalById(id, item.children);
                  if (found) return found;
                }
              }
              return undefined;
            };

            currentItems.forEach(item => {
              const original = findOriginalById(item.id, originalItems);
              if (!original) {
                // console.log(`[${isService ? 'Service' : 'Menu'}] ID ${item.id} (${item.name}): no original found — assuming new`);
                collector(item, isService);
              } else {
                const changedFields = [];

                if (item.permissions.can_create !== original.permissions.can_create) changedFields.push("can_create");
                if (item.permissions.can_read !== original.permissions.can_read) changedFields.push("can_read");
                if (item.permissions.can_update !== original.permissions.can_update) changedFields.push("can_update");
                if (item.permissions.can_delete !== original.permissions.can_delete) changedFields.push("can_delete");

                if (changedFields.length > 0) {
                  console.log(`[${isService ? 'Service' : 'Menu'}] ID ${item.id} (${item.name}): changed fields: ${changedFields.join(", ")}`);
                  collector(item, isService);
                }
              }

              if (item.children) {
                compareAndCollect(item.children, original?.children || [], collector, isService);
              }
            });
          };

          const collectChanged = (item: PermissionItem, isService: boolean) => {
            const base = {
              can_create: item.permissions.can_create,
              can_read: item.permissions.can_read,
              can_update: item.permissions.can_update,
              can_delete: item.permissions.can_delete
            };

            if (isService) {
              services.push({
                service_id: item.id,
                service_name: item.name,
                ...base
              });
            } else {
              menus.push({
                menu_id: item.id,
                ...base
              });
            }
          };

          compareAndCollect(state.permissionItems.services, state.originalPermissionItems.services, collectChanged, true);
          compareAndCollect(state.permissionItems.menus, state.originalPermissionItems.menus, collectChanged, false);

          const payload: RoleAPIPayload = {
            role_name: state.formData.role_name || '',
            scope_id: state.formData.scope_id || 0,
            services,
            menus
          };

          console.log("Final payload (only changed):", payload);
          console.log("state", state);
          console.log("payload", payload);

          try {
            if (state.role?.id) {
              await get().updateRole(state.role.id, payload);
            } else {
              await get().createRole(payload);
            }
            // get().resetForm();
          } catch (error) {
            console.error('Error submitting role:', error);
            throw error;
          }
        },
        resetForm: () => set({
          formData: initialFormData,
          permissionItems: getInitialPermissionItems(),
          role: null
        })
      })
    ),
    {
      name: 'role-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
// Helper function to apply role permissions to permission items
const applyRolePermissionsToItems = (
  items: PermissionItem[],
  rolePermissions: ServicePermission[] | PermissionItem[],
  type: 'service' | 'menu'
): PermissionItem[] => {
  const permissionMap = new Map<number, any>();
  console.log("permissionMap", permissionMap);

  rolePermissions.forEach(perm => {
    const key = type === 'service'
      ? (perm as ServicePermission).id
      : (perm as PermissionItem).id;
    permissionMap.set(key, perm);
  });

  const applyRecursive = (items: PermissionItem[]): PermissionItem[] => {
    return items.map(item => {
      const permission = permissionMap.get(item.id);

      // Fix: Check if permission exists and has the correct structure
      let updatedPermissions = item.permissions;

      if (permission) {
        if (type === 'service') {
          // For services, permissions are at the root level
          updatedPermissions = {
            can_create: permission.can_create || false,
            can_read: permission.can_read || false,
            can_update: permission.can_update || false,
            can_delete: permission.can_delete || false
          };
        } else {
          // For menus, permissions are nested
          updatedPermissions = {
            can_create: permission.permissions?.can_create || false,
            can_read: permission.permissions?.can_read || false,
            can_update: permission.permissions?.can_update || false,
            can_delete: permission.permissions?.can_delete || false
          };
        }
      }

      return {
        ...item,
        permissions: updatedPermissions,
        ...(item.children ? {
          children: applyRecursive(item.children)
        } : {})
      };
    });
  };

  return applyRecursive(items);
};

// Export types for use in components