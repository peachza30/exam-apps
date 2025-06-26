import httpClient from '@/config/axios.config';

export const findAll = async (params: FetchParams) => {
  const query = new URLSearchParams({
    search: params.search ?? '',
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    sort: params.sort ?? 'created_at',
    order: params.order ?? 'ASC',
    status: params.status ?? '',
  }).toString();

  const response = await httpClient.get(`/partners?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/partners/' + id);
  return response.data;
};
export const create = async (data: any) => {
  const response = await httpClient.post('/partners', data);
  console.log("response", response);
  return response.data;
}
export const update = async (id: number, data: any) => {
  console.log("Updating user with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/partners/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/partners/${id}`);
  return response.data;
};



