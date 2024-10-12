import {useState} from 'react';
import {ApiResponse} from '../../BrokerAppCore/services/new/ApiResponse'; // Assuming ApiResponse is defined

export const useApiRequest = <T, P extends any[]>(
  apiFunction: (...params: P) => Promise<ApiResponse<T>>,
  setLoading?: (loading: boolean) => void, // Loading function passed from outside
) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to trigger the API call
  const execute = async (...params: P) => {
    // Call the external loading function, if provided
    if (setLoading) {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await apiFunction(...params);
      // console.log('========response');
      // console.log(JSON.stringify(response));
      if (setLoading) {
        setLoading(false);
      }

      if (!response.success) {
        setError(response.message || 'An error occurred');
        setStatus(response.status || 500);
      } else {
        console.log(JSON.stringify(response));
       // debugger;
        setData(response.data || null);
        setStatus(response.status || 200);
      }
    } catch (error: any) {
      if (setLoading) {
        setLoading(false);
      }

      setError('An unexpected error occurred');
      setStatus(500);
    }
  };

  return {data, status, error, execute};
};
