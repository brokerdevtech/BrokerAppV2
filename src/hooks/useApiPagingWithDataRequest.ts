/* eslint-disable no-trailing-spaces */
/* eslint-disable no-catch-shadow */
import {useRef, useState} from 'react';
import {ApiResponse} from '../../BrokerAppCore/services/new/ApiResponse'; // Assuming ApiResponse is defined

export const useApiPagingWithDataRequest = <T, P extends any[]>(
  apiFunction: (...args: [...P, number, number]) => Promise<ApiResponse<T>>,
  setLoading?: (loading: boolean) => void, // Loading function passed from outside
  ParamData: T | null = null 
) => {
  console.log("ParamData");
  console.log(ParamData);
  const [data, setData] = useState<T | null>(ParamData);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [pageSize, setPageSize] = useState<number>(10); // Default page size
  const [hasMore, setHasMore] = useState<boolean>(true); 
  // Function to trigger the API call

  const paramsRef = useRef<P | null>(null); 

  const execute = async (...params: P) => {
    // Call the external loading function, if provided
    paramsRef.current = params; // Store the parameters for future use
    if (setLoading) {
      setLoading(true);
    }

    setError(null);
    setCurrentPage(1); // Reset to first page for initial load

    try {
    
      const response = await apiFunction(...params, 1, pageSize);
  
      if (setLoading) {
        setLoading(false);
      }

      if (!response.success) {
        setError(response.message || 'An error occurred');
        setStatus(response.status || 500);
      } else {
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

  const loadMore = async (...params: P) => {
    if (hasMore) {
      if (setLoading) {
        setLoading(true);
      }

      try {
        // Use stored params along with current page and page size
        const response = await apiFunction(...params, currentPage + 1, pageSize);

     

        if (!response.success) {
          setError(response.message || 'An error occurred');
          setStatus(response.status || 500);
        } else {
          if(response?.data.length > 0)
       {   setData((prevData) => [...prevData, ...(response.data || [])]);
          setStatus(response.status || 200);
          setCurrentPage((prevPage) => prevPage + 1); // Increment the page count
  
       }
       else{
        setHasMore(false); 
       }
        }

          // Check if more data is available
      
        
      } catch (error: any) {
       

        setError('An unexpected error occurred');
        setStatus(500);
      }
      finally {
        if (setLoading) {
          setLoading(false);
        }
      }
    }
  };

  const pageSize_Set = async (pageSize:number) => {
    setPageSize(pageSize);
  };

  const currentPage_Set = async (currentPage:number) => {
    setCurrentPage(currentPage);
  };
  const hasMore_Set = async (hasMore:boolean) => {
    setHasMore(hasMore);
  };

  return {data, status, error, execute,loadMore,pageSize_Set,currentPage_Set,hasMore_Set};
};
