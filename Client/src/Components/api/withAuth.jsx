import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from './axiosConfig';

export const withAuth = (WrappedComponent, options = {}) => {
  const { redirectTo = '/Auth/Login', requireAuth = true } = options;

  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (requireAuth) {
            // Verify token with backend
            try {
              await apiClient.get('/user/verify-token');
              setIsAuthenticated(true);
            } catch (error) {
              // Token invalid, redirect to login
              router.push(redirectTo);
              return;
            }
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Redirect to login page on error
          router.push('/Auth/Login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router, requireAuth, redirectTo]);



    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated && requireAuth) {
      return null; // Will redirect, so don't render anything
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
