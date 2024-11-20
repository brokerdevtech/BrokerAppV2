import { useState, useEffect } from 'react';

export const useInfiniteScrollWithData = (fetchDataFunction, pageSize,Data,currentItem,Currentpage) => {
  const [data, setData] = useState(Data);
  const [page, setPage] = useState(Currentpage);
  const [currentIndexItem, setcurrentIndexItem] = useState(currentItem);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!loading && hasMore) {
        setLoading(true);
        const newData = await fetchDataFunction(page, pageSize);
        if (newData.length > 0) {
        setData(prevItems => prevItems ? [...prevItems, ...newData] : newData);

        setPage(prev => prev + 1);}
        else{
            setHasMore(false); 
        }
       setLoading(false);
      }
    };

    loadData();
  }, []);
  
  const fetchMoreData = async () => {
    
    if (loading || !hasMore) return; // Check if already loading or no more data

    setLoading(true); // Set loading state
    try {
      
      const newData = await fetchDataFunction( page, pageSize);

      if (newData.length > 0) {
        setData(prevItems => prevItems ? [...prevItems, ...newData] : newData);

        setPage(prev => prev + 1);}
       else {
        setHasMore(false); // Set flag when no more data is available
      }
    } catch (error) {
    //  console.error('Error fetching more data:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  return { data, loading, hasMore,fetchMoreData };
};
