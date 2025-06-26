// Base interfaces
interface FetchPartnerParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

interface PartnerRequest {
  roleId: number
  partner_name: string;
  partner_email: string
  partner_password?: string
  partner_description?: string
  status: string;
}

// Role type (matches your API response)
type RolePartner = {
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

// Partner type (corrected to match API response)
type Partner = {
  id: number;
  partner_name: string;
  partner_code: string; 
  partner_email: string; // Added missing field
  partner_password: string; // Added missing field
  partner_description: string; // Added missing field
  status: string | null;
  created_by?: number | null; // These fields seem to be missing in response
  created_at?: string;
  updated_by?: number | null;
  updated_at?: string;
  deleted_by?: number | null;
  deleted_at?: string | null;
  role: RolePartner;
};

// API Response type
type GetPartnerResponse = {
  statusCode: number;
  message: string;
  data: Partner[];
  metadata: {
    page: string;
    limit: string;
    total: number;
    last_page: number;
  };
};

// Generic fetch params (assuming this is used elsewhere)
interface FetchPartnerParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Partner store
type PartnerStore = {
  partners: Partner[];
  partner: Partner | null;
  metadata: ApiMetadata | null;
  mode: "create" | "edit" | "view" | null;
  loading: boolean;
  error: string | null;
  setMode: (mode: "create" | "edit" | "view") => void;
  fetchPartners: (params: FetchPartnerParams) => Promise<void>;
  fetchPartner: (id: number) => Promise<void>;
  createPartner: (data: PartnerRequest, params: FetchPartnerParams) => Promise<void>;
  updatePartner: (id: number, data: PartnerRequest, params: FetchPartnerParams) => Promise<void>;
  deletePartner: (id: number, params: FetchPartnerParams) => Promise<void>;
};

// Optional: Status enum for better type safety
enum PartnerStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
  DELETED = 'D'
}

// Updated interfaces with enum
interface PartnerRequestWithEnum {
  partner_name: string;
  role: number;
  status: PartnerStatus;
}

type PartnerWithEnum = Omit<Partner, 'status'> & {
  status: PartnerStatus;
};
