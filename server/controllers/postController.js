const Post = require('../models/Post');
const Category = require('../models/Category');
const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().max(100).required(),
  content: Joi.string().required(),
  excerpt: Joi.string().max(200).allow(''),
  category: Joi.string().required(),
  featuredImage: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published').default('draft')
});

const createSlug = (title) => {
  return title.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      status = 'published'
    } = req.query;

    const query = { status };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name slug')
      .populate('comments.author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, content, excerpt, category, featuredImage, tags, status } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const slug = createSlug(title);
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Post with this title already exists' });
    }

    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      author: req.user._id,
      category,
      featuredImage,
      tags,
      status,
      slug
    });

    await post.save();
    await post.populate('author', 'username');
    await post.populate('category', 'name slug');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, excerpt, category, featuredImage, tags, status } = req.body;

    if (title !== post.title) {
      const slug = createSlug(title);
      const existingPost = await Post.findOne({ slug, _id: { $ne: post._id } });
      if (existingPost) {
        return res.status(400).json({ message: 'Post with this title already exists' });
      }
      post.slug = slug;
    }

    post.title = title;
    post.content = content;
    post.excerpt = excerpt || content.substring(0, 200);
    post.category = category;
    post.featuredImage = featuredImage;
    post.tags = tags;
    post.status = status;

    await post.save();
    await post.populate('author', 'username');
    await post.populate('category', 'name slug');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      content: content.trim(),
      author: req.user._id
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'username');

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
