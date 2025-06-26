import httpClient from '@/config/axios.config';

export const findAll = async (params: FetchParams) => {
  const query = new URLSearchParams({
    search: params.search ?? '',
    page: String(params.page ?? ""),
    limit: String(params.limit ?? ""),
    sort: params.sort ?? 'created_at',
    order: params.order ?? 'ASC',
    status: params.status ?? '',
  }).toString();

  const response = await httpClient.get(`/services?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/services/' + id);
  return response.data;
};
export const create = async (data: any) => {
  const response = await httpClient.post('/services', data);
  return response.data;
};
export const update = async (id: number, data: any) => {
  console.log("Updating service with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/services/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/services/${id}`);
  return response.data;
};
