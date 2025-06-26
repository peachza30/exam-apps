import httpClient from '@/config/axios.config';

export const findAll = async (params: FetchRoleParams) => {
  console.log("params", params);
  const query = new URLSearchParams({
    search: params.search ?? '',
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    sort: params.sort ?? 'created_at',
    order: params.order ?? 'ASC',
    status: params.status ?? '',
  }).toString();

  const response = await httpClient.get(`/roles?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/roles/' + id);
  return response.data;
};
export const findScope = async (scope: number) => {
  const response = await httpClient.get('/scopes/' + scope);
  return response.data;
};
export const findAllScope = async () => {
  const response = await httpClient.get('/scopes');
  return response.data;
};
export const create = async (payload: RoleAPIPayload) => {
  const response = await httpClient.post(`/roles`, payload);
  return response.data;
};
export const update = async (id: number, data: any) => {
  console.log("Updating user with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/roles/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/roles/${id}`);
  return response.data;
};



