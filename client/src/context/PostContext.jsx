// src/context/PostContext.jsx

import React, { createContext, useState, useEffect } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Example post loading logic (you can customize this)
  useEffect(() => {
    // Fetch posts or manage global post state here
  }, []);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;