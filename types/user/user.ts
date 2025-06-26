interface FetchUserParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

interface UserRequest {
  role_id: number;
  status: string; // 'A' | 'I' | 'D'
}
type RoleUser = {
  role_id: number;
  name: string;
  role_name: string;
  status: string;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  deleted_by: number | null;
  deleted_at: string | null;
  scope_id: number;
};

type User = {
  statusCode: number;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  deleted_by: number | null;
  deleted_at: string | null;
  role: RoleUser;
};

type GetUsersResponse = {
  statusCode: number;
  message: string;
  data: User[];
  metadata: {
    page: string;
    limit: string;
    total: number;
    last_page: number;
  };
};


type UserStore = {
  users: User[];
  usersById: Record<number, User>;
  user: User | null;
  userById: User | null;
  userByUpdated: User | null;
  metadata: ApiMetadata | null;
  mode: "create" | "edit" | "view" | null;
  loading: boolean;
  error: string | null;
  resetUser: () => void;
  setMode: (mode: "create" | "edit" | "view") => void;
  fetchUsers: (params: FetchParams) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  fetchUserByUpdatedId: (id: number) => Promise<void>;
  createUser: (data: User) => Promise<void>;
  updateUser: (id: number, data: UserRequest, params: FetchParams) => Promise<void>;
  deleteUser: (id: number, params: FetchParams) => Promise<void>;
};
