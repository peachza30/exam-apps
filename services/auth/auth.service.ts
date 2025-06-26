import httpClient from '@/config/axios.config';

export const getProfile = async () => {
  const response = await httpClient.get('/users/profile');
  return response.data;
};
