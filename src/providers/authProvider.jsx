import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import { AuthContext } from './authContext';

import api from '@/services/api';

export default function AuthContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoggingOut) {
      return;
    }
    if (user) return;
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        console.log(response.data);
        setUser(response.data);
        setIsAuthenticated(true);
        console.log('fetch user success');
      } catch {
        console.log('fetch user fail');
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, [token, isLoggingOut, user]);

  useEffect(() => {
    console.log('Token changed:', token);
  }, [token]);

  useEffect(() => {
    console.log('User authenticated:', isAuthenticated);
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/users/refresh-token'
        ) {
          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;
          console.log('Refreshing token...');

          try {
            const response = await api.post(
              '/users/refresh-token',
              {},
              { withCredentials: true }
            );
            const newAccessToken = response.data.accessToken;
            setToken(newAccessToken);
            api.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            console.error('Token refresh failed:', err);
            processQueue(err, null);
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setIsLoggingOut(true);
            navigate('/login', { replace: true });
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      setIsLoggingOut(false);
      const accessToken = response.data.accessToken;
      console.log('login success');
      setToken(accessToken);
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  const register = async (userInfo) => {
    try {
      await api.post('/users', userInfo);
      await login(userInfo.email, userInfo.password);
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    await api.delete('/users/logout');
    setIsLoggingOut(true);
    try {
      await api.get('/users/test-auth');
    } catch (error) {
      if (error.status === 401) {
        console.log('Logout successful');
      }
    }
  };

  const values = {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    register,
    setUser,
  };

  if (!isAuthenticated && !isLoggingOut) {
    return <div></div>;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
