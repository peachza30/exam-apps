import httpClient from '@/config/axios.config';

export const findAll = async (params: FetchParams) => {
  const query = new URLSearchParams({
    search: params.search ?? '',
    page: String(params.page ?? ''),
    limit: String(params.limit ?? ''),
    sort: params.sort ?? 'sequence',
    order: params.order ?? 'ASC',
  }).toString();

  const response = await httpClient.get(`/menus?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/menus/' + id);
  return response.data;
};
export const create = async (payload: any) => {
  console.log("payload", payload);
  const response = await httpClient.post(`/menus`, payload);
  return response.data;
};
export const update = async (id: number, data: any) => {
  console.log("Updating user with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/menus/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/menus/${id}`);
  return response.data;
};



