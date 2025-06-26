export async function refresh(authToken: string) {
  try {
    const res = await fetch('https://auth-dev.tfac.or.th/auth/refresh', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch user: ${res.status} ${res.statusText} ${error?.message || ''}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('getAuthMe error:', error.message || error);
  }
}