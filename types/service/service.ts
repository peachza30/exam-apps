
interface Service {
   id: number;
   service_name: string;
   service_code: string;
   service_description: string;
   status: string; // Could be more specific: 'A' | 'I' | 'D' if you know all possible values
   created_by: number | null;
   created_at: string; // ISO date string
   updated_by: number | null;
   updated_at: string; // ISO date string
   deleted_by: number | null;
   deleted_at: string | null; // ISO date string or null
}

// More specific status type if you know all possible values
type ServiceStatus = 'A' | 'I' | 'D'; // Active, Inactive, Deleted (adjust as needed)

// Alternative with more specific status type
interface ServiceWithStatus {
   id: number;
   service_name: string;
   service_code: string;
   service_description: string;
   status: ServiceStatus;
   created_by: number | null;
   created_at: string;
   updated_by: number | null;
   updated_at: string;
   deleted_by: number | null;
   deleted_at: string | null;
}

// API Response wrapper type
interface ServicesResponse {
   data: Service[];
}
// For API endpoints or components that work with single service
type ServiceInput = Omit<Service, 'id' | 'created_at' | 'updated_at'>;

interface ServiceRequest {
   service_name: string;
   service_description: string;
   status: string; // 'A' | 'I' | 'D'
}

// For updates (partial data)
type ServiceUpdate = Partial<Omit<Service, 'id' | 'created_at'>> & {
   id: number;
};


interface ServiceStore {
   services: Service[];
   service: Service | null;
   metadata: ApiMetadata | null;
   mode: "create" | "edit" | "view" | null;
   loading: boolean;
   error: string | null;
   setMode: (mode: "create" | "edit" | "view") => void;
   fetchService: (params: FetchParams) => Promise<void>;
   fetchServiceById: (id: number) => Promise<void>;
   createService: (data: ServiceRequest, params: FetchParams) => Promise<void>;
   updateService: (id: number, data: ServiceRequest, params: FetchParams) => Promise<void>;
   deleteService: (id: number, params: FetchParams) => Promise<void>;
}