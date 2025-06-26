interface MenuStore {
  menus: MenuItem[];
  menu: MenuItem | null;
  mode: string | null;
  iconName: string | null;
  metadata: ApiMetadata | null;
  loading: boolean;
  error: string | null;
  isReorderMode: boolean;
  // page: number;
  // setPage: (page: number) => void;
  // sort: string;
  // setSort: (sort: string) => void;

  setMode: (mode: string) => void;
  setIsReorderMode: (boolean: boolean) => void;
  setIconName: (iconName: string) => void;
  getMenus: (params?: any) => Promise<void>;
  getMenu: (id: number) => Promise<void>;
  createMenu: (data: MenuItem) => Promise<void>;
  updateMenu: (id: number, data: Partial<MenuItem>) => Promise<void>;

  deleteMenu: (id: number, params?: any) => Promise<void>;
};

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
  icon?: string;
}