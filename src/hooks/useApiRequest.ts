/* eslint-disable no-catch-shadow */
import {useState} from 'react';
import {ApiResponse} from '../../BrokerAppCore/services/new/ApiResponse'; // Assuming ApiResponse is defined

export const useApiRequest = <T, P extends any[]>(
  apiFunction: (...params: P) => Promise<ApiResponse<T>>,
  setLoading?: (loading: boolean) => void, // Loading function passed from outside
) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  // console.log(...params)
  // Function to trigger the API call
  const execute = async (...params: P) => {
    // Call the external loading function, if provided
    if (setLoading) {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await apiFunction(...params);
      // console.log('========broker');
      // console.log(JSON.stringify(response));
      if (setLoading) {
        setLoading(false);
      }

      if (!response.success) {
        if (setLoading) {
          setLoading(false);
        }
        setError(response?.data?.statusMessage || 'An error occurred');
        setStatus(response.status || 500);
   
      } else {
        // debugger;
        setData(response.data || null);
        setStatus(response.status || 200);
      }
    } catch (error: any) {
      if (setLoading) {
        setLoading(false);
      }
      // console.log(error.response.message, 'mesks');
      setError('An unexpected error occurred');
      setStatus(500);
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };
  // console.log(status, 'request');
  return {data, status, error, execute};
};
