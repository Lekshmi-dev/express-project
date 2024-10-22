// controllers/BlogController.js

const { Blog } = require('../models'); // Assuming that you have an index.js in models folder to manage exports
const { User } = require('../models'); // Import User if needed


module.exports = {
    // Create a new blog post
    async create(req, res) {
        try {
            const { title, content } = req.body;
            const userId = req.user.id;
            const newBlog = await Blog.create({ title, content, userId });
            return res.status(201).json({ message: 'Blog Created Successfully', data: newBlog });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating blog', error: error.message })
        }

    },

    // Retrieve all blog posts
    async getAll(req, res) {
        try {
            const blogs = await Blog.findAll({
                include: [{ model: User, attributes: ['name', 'email'] }] // Include the user details
            });
            return res.status(200).json(blogs);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching blogs', error: error.message });
        }
    },

    // Retrieve a single blog post by ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const blog = await Blog.findByPk(id, {
                include: [{ model: User, attributes: ['name', 'email'] }]
            });
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            return res.status(200).json(blog);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching blog', error: error.message });
        }
    },

    // Update a blog post
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Check if the user owns the blog
            if (blog.userId !== req.user.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            blog.title = title;
            blog.content = content;
            await blog.save();
            return res.status(200).json({ message: 'Blog updated successfully', blog });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating blog', error: error.message });
        }
    },

    // Delete a blog post
    async delete(req, res) {
        try {
            const { id } = req.params;
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            // Check if the user owns the blog
            if (blog.userId !== req.user.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            await blog.destroy();
            return res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting blog', error: error.message });
        }
    }
};
