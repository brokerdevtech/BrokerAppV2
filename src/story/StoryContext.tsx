import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getDashboardStory } from '../../BrokerAppCore/services/Story';

interface Story {
  storyId: number;
  caption: string;
  mediaBlob: string;
  mediaType: 'image' | 'video';
  mediaDuration:number;
  mediaHeight: number;
  mediaWidth: number;
  viewerCount: number;
  likeCount: number;
}

interface UserStory {
  userId: number;
  postedBy: string;
  profileImage: string;
  storyDetails: Story[];
}

// interface StoryContextType {
//   stories: UserStory[];
//   loading:boolean,
//   currentStoryUserId: number | null;
//   currentUserIndex: number;
//   currentStoryIndex: number;
//   totalPages: number;
//   recordCount: number;
//   loadMoreStories: () => void;
//   setCurrentUser: (index: number) => void;
//   currentUserStories: UserStory | null;
// }
interface StoryContextType {
  stories: UserStory[];
  loading:boolean,
  totalPages: number;
  recordCount: number;
  currentStoryIndex: number;//selected user index
  currentMediaIndex: number;//current story in a user’s list
  setCurrentUser: (index: number) => void;
  goToNextStory: () => void;
  goToPreviousStory: () => void;
  loadMoreStories: () => void;
  goToNextUser: () => void;
  isStoryViewerVisible: boolean;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider = ({ userId, children }: { userId?: any; children: ReactNode }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryUserId, setcurrentStoryUserId] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(-1);
  const [currentUserStories, setCurrentUserStories] = useState<UserStory| null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isStoryViewerVisible, setStoryViewerVisible] = useState(false);
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // Mocking API fetch
      const response = await getDashboardStory(userId,currentPage,currentPageSize);
            

      setTotalPages(response.data?.totalPages);
      setRecordCount(response.data?.recordCount);
setLoading(false);
        setStories(response.data?.data);
      
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const loadMoreStories = async () => {

    if (currentPage < totalPages) {

      const response = await getDashboardStory(userId,currentPage+1,currentPageSize);
      console.log("loadMoreStories",response.data);
      if(response?.data.data.length > 0)
        {   setStories((prevData) => [...prevData, ...(response?.data?.data || [])]);
        
           
          setCurrentPage((prev) => prev + 1); 
   
        }
    }
  };
  // const setCurrentUser = (index: number) => {
  //   console.log("🔄 Setting current user index:", index);
  //   setCurrentStoryIndex(index);
  //   setcurrentStoryUserId(stories[index]?.userId ?? null);
  //   const userStories = stories.find((story) => story.userId === stories[index]?.userId) || null;
    
  //     setCurrentUserStories(userStories);
  // };

  const setCurrentUser = (index: number) => {
  
    setCurrentStoryIndex(index);
    setCurrentMediaIndex(0);
    if(index==-1)
    {setStoryViewerVisible(false);}
    else{setStoryViewerVisible(true);}
  };


  const goToNextStory = () => {
    if (currentMediaIndex < stories[currentStoryIndex].storyDetails.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
    } else {
      goToNextUser();
    }
  };

  const goToPreviousStory = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setCurrentMediaIndex(stories[currentStoryIndex - 1].storyDetails.length - 1);
    }
  };

  const goToNextUser = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setCurrentMediaIndex(0);
    }
  };
  // const setCurrentUser = (UserId: number) => {
   

  //   const userStories = stories.find((story) => story.userId === UserId) || null;
    
  //  setCurrentUserStories(userStories);
  //   setcurrentStoryUserId(UserId);
  // };

  return (
    <StoryContext.Provider
      value={{ stories, currentStoryIndex, currentMediaIndex,isStoryViewerVisible, goToNextStory, goToPreviousStory, goToNextUser, setCurrentUser,  totalPages, recordCount,loading, loadMoreStories }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
