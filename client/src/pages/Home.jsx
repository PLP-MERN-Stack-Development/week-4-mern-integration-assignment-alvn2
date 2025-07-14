// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import { postService, categoryService } from '../services/api';
import { useApi } from '../hooks/useApi';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load categories using the useApi hook
  const { data: categories } = useApi(() => categoryService.getAllCategories());

  // Fetch posts based on filters
  const fetchPosts = async (page = 1, search = '', category = '') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        ...(search && { search }),
        ...(category && { category })
      };

      const response = await postService.getAllPosts(params);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle search input
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchPosts(1, search, selectedCategory);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchPosts(1, searchTerm, category);
  };

  // Pagination handler
  const handlePageChange = (page) => {
    fetchPosts(page, searchTerm, selectedCategory);
  };

  return (
    <div className="px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MERN Blog</h1>
        <p className="text-xl text-gray-600">Discover amazing stories and insights from our community</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === ''
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories?.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryChange(category._id)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No posts found.</p>
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;