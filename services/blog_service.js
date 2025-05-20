const blog_repository = require('../repositories/blog_repository')
const { cloudinary } = require('../utils/cloudinary');
const streamifier = require('streamifier');

class BlogService {
    async createPost(title, files, content, authorIds) {
        const existingPost = await blog_repository.getPostByTitle(title);
        if (existingPost) {
            throw new Error("Пост з таким заголовком вже існує");
        }

        const { preview } = files;
        if (!preview || !preview.tempFilePath) {
            throw new Error("Фото попереднього перегляду обов'язкове");
        }

        // Завантаження preview-зображення на Cloudinary через tempFilePath
        const uploadResponse = await cloudinary.uploader.upload(preview.tempFilePath, {
            folder: 'posts',
        });

        // Створення посту
        return await blog_repository.createPost(title, uploadResponse.secure_url, content, authorIds);
    }

    async editPost(id, data, previewFile) {
        const post = await blog_repository.getPostById(id);
        if (!post) {
            throw new Error("Пост не знайдено");
        }

        const { title, content, authorIds } = data;

        if (title && title !== post.title) {
            const existingPost = await blog_repository.getPostByTitle(title);
            if (existingPost) {
                throw new Error("Пост з таким заголовком вже існує");
            }
            post.title = title;
        }

        if (content !== undefined) {
            post.content = content;
        }

        if (authorIds && authorIds.length > 0) {
            await post.setAuthors(authorIds);
        }

        if (previewFile) {
            // Видалення старого зображення з Cloudinary
            const publicId = post.preview.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`posts/${publicId}`);

            if (previewFile.mimetype.startsWith('image')) {
                // Завантаження нового зображення на Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(previewFile.tempFilePath, {
                    folder: 'posts',
                });
                post.preview = uploadResponse.secure_url;
            } else {
                throw new Error('Файл не є зображенням');
            }
        }

        await post.save();
        return post;
    }

    async deletePost(id) {
        const post = await blog_repository.getPostById(id);
        if (!post) {
            throw new Error("Пост не знайдено");
        }

        if (post.preview) {
            const filename = post.preview.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`posts/${filename}`);
        }

        return await blog_repository.deletePost(post);
    }

    async getAllPosts(page, limit) {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        return await blog_repository.getAllPosts(pageNumber, limitNumber)
    }
    async getFullPost(id) {
        try {
            const post = await blog_repository.getFullPost(id);
            if (!post) {
                throw new Error('Пост не знайдено.');
            }
            return post;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new BlogService()