"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from './hooks/useAuth';
import NonSignUser from './components/dashboard/NonSignUser';
import Loader from './loading';

export default function HomePage() {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn && user) {
      const role = user.role || 'student';
      if (role === 'teacher') {
        router.push('/teacher-dashboard');
      } else if (role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/student-dashboard');
      }
    }
  }, [isLoggedIn, user, loading, router]);

  if (!isLoggedIn) {
    return <NonSignUser />;
  }

  return (
    <Loader/>
  );
}
