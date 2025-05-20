const ApiError = require('../errors/ApiError')
const blog_service = require('../services/blog_service')

class BlogController {
    async createPost(req, res, next) {
        try {
            const { title, content } = req.body;
            let authorIds = req.body.authorIds;

            if (!title) {
                return next(ApiError.badRequest("Заголовок обов'язковий для створення посту"));
            }
            if (!req.files) {
                return next(ApiError.badRequest("Фото попереднього перегляду обов'язкове"));
            }
            if (!content) {
                return next(ApiError.badRequest("Зміст посту обов'язковий для створення посту"));
            }

            if (!authorIds) {
                return next(ApiError.badRequest("Вкажіть принаймні одного автора"));
            }

            if (!Array.isArray(authorIds)) {
                authorIds = [authorIds];
            }
            authorIds = authorIds.map(id => parseInt(id));

            if (authorIds.length === 0) {
                return next(ApiError.badRequest("Вкажіть принаймні одного автора"));
            }

            const post = await blog_service.createPost(title, req.files, content, authorIds);
            return res.status(200).json(post);

        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async editPost(req, res, next) {
        try {
            const data = {
                title: req.body.title,
                content: req.body.content,
                authorIds: req.body.authorIds
            };
            const preview = req.files?.preview;
            console.log(req.body);  // для перевірки полів без файлів
            console.log(req.files); // для перевірки файлів
            const updatedPost = await blog_service.editPost(req.params.id, data, preview);
            return res.status(200).json(updatedPost);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async deletePost(req, res, next) {
        try {
            await blog_service.deletePost(req.params.id)
            return res.status(200).json("Пост успішно видалено")
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const { page = 1, limit = 5 } = req.query;
            const posts = await blog_service.getAllPosts(page, limit)
            return res.status(200).json(posts)
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    async getFullPost(req, res, next) {
        try {
            const post = await blog_service.getFullPost(req.params.id)
            return res.status(200).json(post)
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
}

module.exports = new BlogController()