import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import { getDashboardStory } from '../../BrokerAppCore/services/Story';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

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
  updateCurrentStory:(newStoryState:any)=>void;
  deleteCurrentStory: () => void
  isStoryViewerVisible: boolean;
  fetchStories:any;
  goToPreviousUser:any;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider = ({ userId, children }: { userId?: any; children: ReactNode }) => {
  const [stories, setStories] = useState<UserStory[]>([]);
   const navigation = useNavigation();
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
    const isLoadingMore = useRef(false);
    // useFocusEffect(
    //   useCallback(() => {
    //     setCurrentPage(1);
    //     setCurrentPageSize(5);
    //     fetchStories();
    //   }, [])
    // );

  const fetchStories = async () => {
    try {
      // Mocking API fetch
    //  console.log("====================================fetchStories===============================");
      setCurrentPage(1);
      setCurrentPageSize(5);
      const response = await getDashboardStory(userId,1,currentPageSize);
            
//console.log(JSON.stringify( response.data?.data));
      setTotalPages(response.data?.totalPages);
      setRecordCount(response.data?.recordCount);
setLoading(false);
        setStories(response.data?.data);
      
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const loadMoreStories = async () => {
    if (isLoadingMore.current || currentPage >= totalPages) return;
  
    isLoadingMore.current = true;
  
    const response = await getDashboardStory(userId, currentPage + 1, currentPageSize);
    if (response?.data?.data?.length > 0) {
      setStories(prev => [...prev, ...response.data.data]);
      setCurrentPage(prev => prev + 1);
    }
  
    isLoadingMore.current = false;
  };
  const loadMoreStories1 = async () => {

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
    {setStoryViewerVisible(false);
      navigation.goBack();
    }
    else{setStoryViewerVisible(true);}
  };

  // const goToNextUser = () => {
  //   setCurrentStoryIndex(prevIndex => {
  //     const nextIndex = prevIndex + 1;
  
  //     if (nextIndex < stories.length) {
  //       setCurrentMediaIndex(0); // ✅ Now it's tied to the new user
  //       if (stories.length - nextIndex <= 2) {
  //         loadMoreStories();
  //       }
  //     } else {
  //       setCurrentUser(-1);
  //     }
  
  //     return nextIndex;
  //   });
  // };
  const goToNextStory = () => {
    if (currentMediaIndex < stories[currentStoryIndex].storyDetails.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
    } else {
      goToNextUser();
    }
  };
  const goToNextUser = () => {
    setCurrentStoryIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
  
      if (nextIndex < stories.length) {
        const newUserStories = stories[nextIndex]?.storyDetails || [];
        setCurrentMediaIndex(0); // ✅ always reset to first story
  
        // Prefetch if near end
        if (stories.length - nextIndex <= 2) {
          loadMoreStories();
        }
  
        return nextIndex;
      } else {
        setCurrentUser(-1); // Close viewer
        return prevIndex;
      }
    });
  };
  // const goToPreviousStory = () => {
  //   if (currentMediaIndex > 0) {
  //     setCurrentMediaIndex((prev) => prev - 1);
  //   } else if (currentStoryIndex > 0) {
  //     setCurrentStoryIndex((prev) => prev - 1);
  //     setCurrentMediaIndex(stories[currentStoryIndex - 1].storyDetails.length - 1);
  //   }
  // };
  const goToPreviousStory = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prevStoryIndex) => {
        const newStoryIndex = prevStoryIndex - 1;
        const previousUserStories = stories[newStoryIndex]?.storyDetails || [];
  
        setCurrentMediaIndex(previousUserStories.length - 1);
        return newStoryIndex;
      });
    } else {
      setCurrentUser(-1); // Optional: close viewer if already at first user/story
    }
  };
  // const goToNextUser = () => {
  
  //   if (currentStoryIndex < stories.length - 1) {
  //     setCurrentStoryIndex((prev) => prev + 1);
  //     setCurrentMediaIndex(0);
  //     if (stories.length - currentStoryIndex <= 2) {
  //       console.log("Current story index======================================");
  //       loadMoreStories();  // 👈 this will fetch next page in the background
  //     }

  //   }
  //   else{
  //     setCurrentUser(-1);
  //   }
  // };
  // const setCurrentUser = (UserId: number) => {
   

  //   const userStories = stories.find((story) => story.userId === UserId) || null;
    
  //  setCurrentUserStories(userStories);
  //   setcurrentStoryUserId(UserId);
  // };
  const updateCurrentStory = (newStoryState:any) => {
    setStories((prevStories) => {
      return prevStories.map((userStory, userIndex) => {
        if (userIndex === currentStoryIndex) {
          return {
            ...userStory,
            storyDetails: userStory.storyDetails.map((story, mediaIndex) => {
              if (mediaIndex === currentMediaIndex) {
                return {
                  ...story,
                  ...newStoryState, // Update properties (likeCount, reactionCount, etc.)
                };
              }
              return story;
            }),
          };
        }
        return userStory;
      });
    });
  };

  const deleteCurrentStory = () => {
    setStories((prevStories) => {
      return prevStories
        .map((userStory, userIndex) => {
          if (userIndex === currentStoryIndex) {
            // Remove the current story from the user's list
            const updatedStories = userStory.storyDetails.filter(
              (_, mediaIndex) => mediaIndex !== currentMediaIndex
            );
  
            // If no stories remain for the user, remove the user
            if (updatedStories.length === 0) {
              return null; // Mark for removal
            }
  
            return {
              ...userStory,
              storyDetails: updatedStories,
            };
          }
          return userStory;
        })
        .filter(Boolean); // Remove null entries (users with no stories)
    });
  
    // Move to the next story, or close viewer if no more stories exist
    setTimeout(() => {
      const newStories = stories.filter(user => user?.storyDetails?.length > 0);
    
      if (newStories.length === 0) {
        setCurrentUser(-1); // No stories left, close viewer
      } else {
        const currentUserStories = newStories[currentStoryIndex]?.storyDetails;
    
        if (!currentUserStories || currentMediaIndex >= currentUserStories.length) {
          setCurrentMediaIndex(0); // Reset index if out of range
        }
    
        goToNextStory();
      }
    }, 300);
  };
  const goToPreviousUser = () => {
    setCurrentStoryIndex((prevIndex) => {
      const prevUserIndex = prevIndex - 1;
  
      if (prevUserIndex >= 0) {
        setCurrentMediaIndex(0); // Start at first story of previous user
        return prevUserIndex;
      } else {
        setCurrentUser(-1); // Or do nothing if already at first user
        return prevIndex;
      }
    });
  };
  


  return (
    <StoryContext.Provider
      value={{ stories, currentStoryIndex, currentMediaIndex,isStoryViewerVisible, goToNextStory, goToPreviousStory, goToNextUser, setCurrentUser,  totalPages, recordCount,loading, loadMoreStories,updateCurrentStory,deleteCurrentStory,fetchStories,goToPreviousUser }}
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
