import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from './axiosConfig';

export const ProtectedRoute = ({ children, fallback = null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use server endpoint to verify token instead of reading cookies
        const response = await apiClient.get('/user/verify-token');
        
        if (response.data?.data?.authenticated) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          
          // Only redirect if we're not already on an auth page
          if (!pathname?.includes('/Auth/')) {
            router.push('/Auth/Login');
          }
        }
      } catch (error) {
        setIsAuth(false);
        
        // Only redirect if we're not already on an auth page
        if (!pathname?.includes('/Auth/')) {
          router.push('/Auth/Login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we're on an auth page, don't check authentication
  if (pathname?.includes('/Auth/')) {
    return children;
  }

  if (!isAuth) {
    return null; // Will redirect, so don't render anything
  }

  return children;
};

export default ProtectedRoute;
