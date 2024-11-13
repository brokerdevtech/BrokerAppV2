import {useCallback, useEffect, useRef, useState} from 'react';
import {ApiResponse} from '../../BrokerAppCore/services/new/ApiResponse'; // Assuming ApiResponse is defined

export const useApiPagingWithtotalRequest = <T, P extends any[]>(
  apiFunction: (...args: [...P, number, number]) => Promise<ApiResponse<T>>,
  setLoading?: (loading: boolean) => void, 
  ApipageSize:number=5
  // Loading function passed from outside
) => {
  const [data, setData] = useState<T | null>(null);
  const [totalPages, settotalPages] = useState<T | null>(null);
  const [recordCount, setrecordCount] = useState<T | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [pageSize, setPageSize] = useState<number>(ApipageSize); // Default page size
  const [hasMore, setHasMore] = useState<boolean>(true); 
  // Function to trigger the API call
  const isMounted = useRef(true); // Flag to track if the component is mounted
  const paramsRef = useRef<P | null>(null); 

  const execute =  useCallback(async (...params: P) => {

    // Call the external loading function, if provided
    paramsRef.current = params; // Store the parameters for future use
    if (setLoading) {
      setLoading(true);
    }

    setError(null);
    setCurrentPage(1); // Reset to first page for initial load
    setHasMore(true); // Reset hasMore for fresh load
    try {
   
      const response = await apiFunction(...params, 1, pageSize);
      if (isMounted.current) { // Only update state if the component is mounted
      if (setLoading) {
        setLoading(false);
      }

      if (!response.success) {
        setError(response.message || 'An error occurred');
        setStatus(response.status || 500);
      } else {
      
        setData(response.data.data || null);
        settotalPages(response.data.totalPages || null)
        setrecordCount(response.data.recordCount || null)
        setStatus(response.status || 200);
      }
   }
   } catch (error: any) {
    if (isMounted.current) {
      if (setLoading) {
        setLoading(false);
      }

      setError('An unexpected error occurred');
      setStatus(500);}
    }
  }, [apiFunction, pageSize, setLoading]);




  const loadMore  = useCallback(async (...params: P) => {
    if (hasMore) {
      if (setLoading) {
        setLoading(true);
      }

      try {
        // Use stored params along with current page and page size
        const response = await apiFunction(...params, currentPage + 1, pageSize);

     
        if (isMounted.current) { 
        if (!response.success) {
          setError(response.message || 'An error occurred');
          setStatus(response.status || 500);
        } else {
        
          if(response?.data.data!=null && response?.data.data.length > 0)
       {   setData((prevData) => [...prevData, ...(response.data.data || [])]);
          setStatus(response.status || 200);
          setCurrentPage((prevPage) => prevPage + 1); // Increment the page count
      
       }
       else{

        setHasMore(false); 
       }
        }

         }   // Check if more data is available
      
        
      } catch (error: any) {
        if (isMounted.current) { 

        setError('An unexpected error occurred');
        setStatus(500);}
      }
      finally {
        if (isMounted.current && setLoading) {
          setLoading(false);
        }
      }
    }
  }, [apiFunction, currentPage, hasMore, pageSize, status, setLoading]);

  const pageSize_Set = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
  }, []);

  const currentPage_Set = useCallback((newCurrentPage: number) => {
    setCurrentPage(newCurrentPage);
  }, []);

  const hasMore_Set = useCallback((newHasMore: boolean) => {
    setHasMore(newHasMore);
  }, []);
  useEffect(() => {
    isMounted.current = true; // Set mounted to true when the hook is initialized
    return () => {
      isMounted.current = false; // Set mounted to false when the component unmounts
      if (setLoading) setLoading(false); // Reset loading state when unmounted
    };
  }, [setLoading]);
  const setData_Set  = (newData: T | null) => {
   
    // console.log('oldData');
    // console.log(data);
    // let newd=  data.map((item) =>
    //   item.postId === newData?.postId ? newData : item
    // )
    // setData(newd);
    // console.log(newd);

  };
  return {data, status, error, execute,loadMore,pageSize_Set,currentPage_Set,hasMore_Set,totalPages,recordCount,hasMore,setData_Set};
};
