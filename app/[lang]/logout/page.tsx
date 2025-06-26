'use client';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LogOut() {
  const router = useRouter();

  const logoutpage = () => {
    axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    router.push('/');
  };

  useEffect(() => {
    logoutpage();
  }, []);

  return <div>Logging out...</div>;
}

export default LogOut;
