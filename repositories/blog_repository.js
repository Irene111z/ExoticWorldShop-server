const { Author, Post, PostAuthor } = require('../models/models')

class BlogRepository {
    async createPost(title, preview, content, authorIds) {
        const post = await Post.create({ title, preview, content })
        const authors = await Author.findAll({
            where: {
                id: authorIds
            }
        });
        await post.addAuthors(authors);
        return post;
    }
    async getPostByTitle(title) {
        return await Post.findOne({ where: { title } })
    }
    async getPostById(id) {
        return await Post.findByPk(id);
    }
    async updatePost(post, data) {
        const { title, content, authorIds } = data;
    
        // Оновлення поля заголовка
        if (title) {
            post.title = title;
        }
    
        // Оновлення контенту
        if (content) {
            post.content = content;
        }
    
        // Оновлення авторів
        if (authorIds) {
            await post.setAuthors(authorIds);  // Заміняє всіх авторів поста
        }
    
        // Збереження посту
        await post.save();
        return post;
    }
    
    async deletePost(post) {
        return await post.destroy()
    }
    async getAllPosts(page, limit) {
        const posts = await Post.findAndCountAll({
            attributes: ['id', 'title', 'preview', 'createdAt'],
            limit: limit, // Кількість постів на сторінку
            offset: (page - 1) * limit, // Визначаємо offset для пагінації
        });

        return {
            posts: posts.rows, // Пости для поточної сторінки
            total: posts.count, // Загальна кількість постів
        };
    }
    async getFullPost(id) {
        try {
            const post = await Post.findOne({
                where: { id },
                attributes: ['id', 'title', 'preview', 'content', 'createdAt'],
                include: [{
                    model: Author,
                    attributes: ['id', 'name', 'lastname', 'occupation', 'workplace', 'sity'],
                    through: { attributes: [] },
                    as: 'authors'
                }]
            });

            if (!post) {
                return null;
            }

            const formattedPost = post.get({ plain: true });
            formattedPost.createdAt = new Date(formattedPost.createdAt).toISOString().split('T')[0];
            return formattedPost;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new BlogRepository()