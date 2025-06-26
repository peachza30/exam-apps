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
    console.log("query", query);

  const response = await httpClient.get(`/users?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/users/' + id);
  return response.data;
};
export const update = async (id: number, data: any) => {
  console.log("Updating user with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/users/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/users/${id}`);
  return response.data;
};



