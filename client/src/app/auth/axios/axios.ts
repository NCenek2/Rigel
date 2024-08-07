import axios from 'axios';
import { ROUTE } from '../../shared/shared.constants';
import { Token } from '../auth.model';

export default axios.create({
  baseURL: ROUTE.BASE_URL,
});

const axiosPrivate = axios.create({
  baseURL: ROUTE.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function useAxiosPrivate(auth: Token | null) {
  const requestIntercept = axiosPrivate.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // const responseIntercept = axiosPrivate.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const prevRequest = error?.config;
  //     if (error?.response?.status === 403 && !prevRequest?.sent) {
  //       prevRequest.sent = true; // Prevents multiple retries
  //       // response?.data?.accessToken

  //       const newAccessToken = await refresh();

  //       prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
  //       return axiosPrivate(prevRequest);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  // axiosPrivate.interceptors.request.eject(requestIntercept);

  return axiosPrivate;
}
