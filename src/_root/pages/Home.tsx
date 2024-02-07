import React from 'react'

const Home = () => {
  const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts(); 
  const { data: creators, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers(10); 

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

        </div>
      </div>
      <div className="home-creators"></div>
    </div>
  )
}

export default Home