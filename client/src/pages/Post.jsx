// src/pages/Post.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi'; // ✅ Named import

const Post = () => {
  const { id } = useParams();
  const { loading, error, request } = useApi();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await request(`/api/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id, request]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return post ? (
    <div>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-2">Category: {post.category.name}</p>
      <p className="text-gray-600 mb-4">Author: {post.author.username}</p>
      <p>{post.content}</p>
    </div>
  ) : null;
};

export default Post;