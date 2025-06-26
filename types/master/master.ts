type MenuPermission = {
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

type MenuGroup = {
  isHeader: boolean;
  title: string;
};

type MultiMenuItem = {
  title: string;
  icon?: string;
  href?: string;
} & MenuPermission;

type ChildMenuItem = {
  title: string;
  icon?: string;
  href?: string;
  multi_menu?: MultiMenuItem[];
} & MenuPermission;

type Menu = {
  title: string;
  icon?: string;
  href?: string;
  isHeader?: boolean;
  group?: MenuGroup;
  child?: ChildMenuItem[];
} & MenuPermission;

type MasterStore = {
  menus_list: Menu[];
  loading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
};

interface FetchParams {
  search?: string;
  status?: string;
  page?: any;
  limit?: any;
  sort?: any;
  order?: 'ASC' | 'DESC';
}
interface ApiMetadata {
  page: string;
  limit: string;
  total: number;
  last_page: number;
}

interface ValidationErrors {
  partnerName?: string;
  partnerEmail?: string;
  partnerPassword?: string;
  role?: string;
}
// type MenuPermissions = {
//   canRead: boolean;
//   canCreate: boolean;
//   canUpdate: boolean;
//   canDelete: boolean;
// };

// type GroupMenu = {
//   group_id: number;
//   group_name: string;
//   group_status: boolean;
// };

// type MenuItem = {
//   id: number;
//   name: string;              // เดิมคือ title
//   icon?: string;
//   path?: string;             // เดิมคือ href
//   parent_id: number;
//   groupMenu: GroupMenu;
//   permissions: MenuPermissions;
//   children?: MenuItem[];     // รองรับเมนูย่อย
// };

// type MasterStore = {
//   menus_list: MenuItem[];
//   loading: boolean;
//   error: string | null;
//   fetchMenus: () => Promise<void>;
// };
// types/iconify.ts

/**
 * Basic icon information
 */
