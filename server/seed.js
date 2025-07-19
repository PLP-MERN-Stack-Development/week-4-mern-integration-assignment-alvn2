const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Post.deleteMany({});

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Technology', description: 'Tech news and tutorials', slug: 'technology' },
    { name: 'Lifestyle', description: 'Life, health, and wellness', slug: 'lifestyle' },
    { name: 'Travel', description: 'Travel stories and tips', slug: 'travel' },
  ]);

  // Create a user
  const user = await User.create({
    username: 'demo',
    email: 'demo@example.com',
    password: 'Demo1234', // Make sure your User model hashes passwords
  });

  // Create posts
  await Post.insertMany([
    {
      title: 'Welcome to the MERN Blog!',
      content: 'This is your first post. Edit or delete it, then start blogging!',
      excerpt: 'This is your first post. Edit or delete it, then start blogging!',
      author: user._id,
      category: categories[0]._id,
      featuredImage: '',
      tags: ['welcome', 'mern'],
      status: 'published',
      slug: 'welcome-to-the-mern-blog',
      isPublished: true,
    },
    {
      title: 'Traveling the World',
      content: 'Travel opens your mind and heart. Here are some tips for your next adventure.',
      excerpt: 'Travel opens your mind and heart.',
      author: user._id,
      category: categories[2]._id,
      featuredImage: '',
      tags: ['travel', 'adventure'],
      status: 'published',
      slug: 'traveling-the-world',
      isPublished: true,
    },
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 