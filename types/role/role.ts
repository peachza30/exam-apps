interface FetchRoleParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}
interface RoleRequest {
  role: string;
  status: string; // 'A' | 'I' | 'D'
}
type RoleScope = {
  id: number;
  role_id: number;
  role_name: string;
  description?: string;
  status: string;
  scope_id: number;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  deleted_by: number | null;
  deleted_at: string | null;
  services: ServicePermission[];
  menus: MenuItem[];
};
type Scope = {
  id: number;
  scope_name: string;
  status: string;
  created_at: Date | string | null;
  created_by: number | null;
  updated_at: Date | string | null;
  updated_by: number | null;
  deleted_at: Date | string | null;
  deleted_by: number | null;
  roles: RoleScope[]; // Fixed here
};
interface Permission {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}
interface ServicePermission extends Permission {
  service_id: number;
}
interface MenusPermission {
  menu_id: number;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}
interface PermissionItem {
  id?: number;
  name: string;
  permissions: {
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  };
  isExpanded?: boolean;
  children?: PermissionItem[];
}
interface RoleFormData {
  id: number,
  role_id: number,
  role_name: string;
  description?: string;
  status: string,
  scope_id: number | null;
  status_active: boolean;
  services: ServicePermission[];
  menus: MenuItem[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}
interface RoleAPIPayload {
  role_name: string;
  scope_id: number;
  services: ServicePermission[];
  menus: MenusPermission[];
}

interface RoleStore {
  // State
  formData: RoleFormData;
  permissionItems: {
    services: PermissionItem[];
    menus: PermissionItem[];
  };
  originalPermissionItems: {
    services: PermissionItem[];
    menus: PermissionItem[];
  };
  roles: RoleScope[];
  roleScope: Scope | null;
  roleScopes: { [key: string]: string };
  scopes: Scope[] | null;
  role: RoleScope | null;
  metadata: ApiMetadata | null;
  mode: "create" | "edit" | "view" | null;
  loading: boolean;
  error: string | null;

  // Actions
  setMode: (mode: "create" | "edit" | "view") => void;
  fetchRoles: (params?: any) => Promise<void>;
  fetchRolesScope: (scope: any) => Promise<void>;
  fetchRole: (id: number) => Promise<void>;
  fetchScope: () => Promise<void>;
  createRole: (data: any) => Promise<void>;
  updateRole: (id: number, data: any, params?: any) => Promise<void>;
  deleteRole: (id: number, params?: any) => Promise<void>;
  initializeServices: () => Promise<void>;
  initializeMenus: () => Promise<void>;
  initializeAll: () => Promise<void>;
  loadRoleData: (roleId: number) => Promise<void>;
  setRoleName: (name: string) => void;
  setRoleDescription: (description: string) => void;
  setScopeId: (id: number) => void;
  setStatusActive: (active: boolean) => void;
  togglePermission: (category: 'services' | 'menus', itemId: number, permissionType: string) => void;
  toggleAllPermissions: (category: 'services' | 'menus', itemId: number) => void;
  toggleExpanded: (category: 'services' | 'menus', itemId: number) => void;
  submitRole: () => Promise<void>;
  resetForm: () => void;
  getMenuConfig: () => MenuItemProps[];
}

