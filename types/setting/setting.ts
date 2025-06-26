

// interface Scope {
//   scope_id: number,
//   scope_name: string,
//   scope_status: string,
//   created_at: Date | null;
//   updated_at: Date | null;
//   deleted_at: Date | null;
//   roles: Role[]
// }

interface DatabaseRole {
  role_id: number;
  role_name: string;
  role_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

// interface Partner {
//   partner_id?: number;
//   partner_name: string;
//   partner_email: string;
//   password_hash: string;
//   api_key?: string;
//   status?: string;
//   create_date?: string;
//   update_date?: string;
//   role_id: number;
//   role?: DatabaseRole;
// }

interface UserInfo {
  name: string;
  avatar: string;
  title: string;
  email: string;
}

interface RoleInfo {
  id: number;
  name: string;
  scope: string[];
}

interface Settings {
  id: number;
  user: UserInfo;
  role: RoleInfo;
  amount: number;
  status: string;
  email: string;
}

interface SettingStore {
  settings: Settings[];
  setting: Settings | null;
  roles: Role[];
  role: Role | null;
  partners: Partner[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  sort: string;
  setSort: (sort: string) => void;

  getRolesSetting: (scopeId: number) => Promise<void>;
  getUsersSetting: () => Promise<void>;
  createUsersSetting: (data: Settings) => Promise<void>;
  editUsersSetting: (data: Settings, id: number) => Promise<void>;
  deleteUsersSetting: (id: number) => Promise<void>;
  getPartnersSetting: () => Promise<void>;
  createPartnersSetting: (data: Partner) => Promise<void>;
  editPartnersSetting: (data: Settings, id: number) => Promise<void>;
  deletePartnersSetting: (id: number) => Promise<void>;
  getMembersSetting: () => Promise<void>;
  createMembersSetting: (data: Settings) => Promise<void>;
  editMembersSetting: (data: Settings, id: number) => Promise<void>;
  deleteMembersSetting: (id: number) => Promise<void>;
};

interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
  icon?: string;
}