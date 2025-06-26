interface ServicePermission {
   id: number;
   service_id: number;
   service_name: string;
   can_create: boolean;
   can_read: boolean;
   can_update: boolean;
   can_delete: boolean;
}
interface ApiService {
   id: number;
   service_id: number;
   service_name: string;
   can_create: boolean;
   can_read: boolean;
   can_update: boolean;
   can_delete: boolean;
}

interface ApiMenu {
   id: number;
   menu_name: string;
   path: string;
   icon: string | null;
   parent_id: number;
   status: string;
   sequence: number;
   can_create: boolean;
   can_read: boolean;
   can_update: boolean;
   can_delete: boolean;
   created_by: number | null;
   created_at: string;
   updated_by: number | null;
   updated_at: string;
   deleted_by: number | null;
   deleted_at: string | null;
   children?: ApiMenu[]; // This will be added during processing
}

interface ApiRole {
   role_id: number;
   role_name: string;
   scope_id: number;
   services: ApiService[];
   menus: ApiMenu[] | null;
}

interface ApiUser {
   id: number;
   email: string;
   first_name: string;
   last_name: string;
   role: ApiRole | null;
}

// Define the target menu structure types
interface MenuItemProps {
   title: string;
   icon?: any;
   href?: string;
   path?: string;
   child?: MenuItemProps[];
   megaMenu?: MenuItemProps[];
   multi_menu?: MenuItemProps[];
   nested?: MenuItemProps[];
   onClick?: () => void;
   isHeader?: boolean;
}

// Type specifically for Modern Nav used in ModuleSidebar
type ModernNavType = MenuItemProps;

interface MenusConfig {
   mainNav: MenuItemProps[];
   sidebarNav: {
      modern: MenuItemProps[];
      classic: MenuItemProps[];
   };
}
// Menu item interface (recursive for nested menus)
interface MenuItem {
   id?: number;
   menu_name: string;
   parent_id: number;
   icon: string | null;
   path: string;
   status?: string | "A" | "I";
   active?: boolean;
   can_create?: boolean;
   can_read?: boolean;
   can_update?: boolean;
   can_delete?: boolean;
   children?: MenuItem[];
   sequence?: number;
   created_by?: number | null;
   created_at?: string | null;
   updated_by?: number | null;
   updated_at?: string | null;
   deleted_by?: number | null;
   deleted_at?: string | null;
}

type DropPosition = "before" | "after" | "inside";

interface DropZone {
   targetId: number | null;
   position: DropPosition;
   parentId: number;
}

// Role interface
interface Role {
   role_id: number;
   role_name: string;
   scope_id: number;
   services: ServicePermission[];
   menus: MenuItem[];
}

// User profile interface
interface UserProfile {
   id: number;
   email: string;
   first_name: string;
   last_name: string;
   role: Role;
}

// Auth store interface
interface AuthStore {
   profile: ApiUser | null;
   loading: boolean;
   error: string | null;
   fetchProfile: () => Promise<void>;
}

// Additional utility types
type PermissionAction = 'create' | 'read' | 'update' | 'delete';

// Helper type for checking permissions
interface PermissionCheck {
   can_create: boolean;
   can_read: boolean;
   can_update: boolean;
   can_delete: boolean;
}