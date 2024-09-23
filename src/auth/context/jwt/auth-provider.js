'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { getUserRole } from 'src/utils/misc';
import { getData, saveData } from 'src/utils/storage';
import axios, { endpoints, API_ROUTER } from 'src/utils/axios';

import { STORAGE_KEYS } from 'src/constants';
import { axiosPost } from 'src/services/axiosHelper';

import { setSession } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = getData(STORAGE_KEYS.AUTH_TOKEN);
      const rToken = getData(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
      const authUser = getData(STORAGE_KEYS.AUTH);

      if (accessToken) {
        setSession(accessToken, rToken, handleTokenExpiration, handleRTExpiration);
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...authUser,
              role: getUserRole(authUser),
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleRTExpiration = async () => {
    try {
      setSession(null);
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTokenExpiration = useCallback(async () => {
    try {
      const rT = getData(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
      const res = await axiosPost(API_ROUTER.tokenRefresh, {
        refresh: rT,
      });
      if (res.status) {
        setSession(res?.access, rT, handleTokenExpiration, handleRTExpiration);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // VERIFY
  const verify = useCallback(
    async (code) => {
      const data = {
        code,
      };
      const response = await axiosPost(API_ROUTER.verify, data);
      const {
        tokens: { access, refresh },
        user,
      } = response;
      if (response?.status) {
        setSession(access, refresh, handleTokenExpiration, handleRTExpiration);
        saveData(STORAGE_KEYS.AUTH, {
          ...user,
          role: getUserRole(user),
        });
        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              ...user,
              role: getUserRole(user),
            },
          },
        });
        return { status: response.status };
      }
      return { status: response.status };
    },
    [handleTokenExpiration]
  );

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      verify,
    }),
    [login, logout, register, state.user, status, verify]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
