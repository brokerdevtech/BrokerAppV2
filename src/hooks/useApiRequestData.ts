/* eslint-disable no-catch-shadow */
import {useState} from 'react';
import {ApiResponse} from '../../BrokerAppCore/services/new/ApiResponse'; // Assuming ApiResponse is defined

export const useApiRequestData = <T, P extends any[]>(
  apiFunction: (...params: P) => Promise<ApiResponse<T>>,
  setLoading?: (loading: boolean) => void, // Loading function passed from outside
  ParamData: T | null = null 
) => {
  const [data, setData] = useState<T | null>(ParamData);
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
      // console.log(JSON.stringify(response.data));
      if (setLoading) {
        setLoading(false);
      }

      if (!response.success) {
        if (setLoading) {
          setLoading(false);
        }
        setError(response?.message || 'An error occurred');
        setStatus(response.status || 500);
      } else {
        // debugger;
        // console.log(response.data, 'branfd');
        setData(response.data || null);
        setStatus(response.status || 200);
      }
      return response.data ;
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

  return {data, status, error, execute};
};
