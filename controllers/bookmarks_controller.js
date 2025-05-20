const ApiError = require('../errors/ApiError')
const bookmarks_service = require('../services/bookmarks_service')

class BookmarksController{
    async getBookmarks(req, res, next){
        try {
            const userId = req.user.id
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            const bookmarks = await bookmarks_service.getBookmarks(userId)
            return res.status(200).json(bookmarks)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async savePost(req, res, next){
        try {
            const userId = req.user.id
            const postId = req.body.postId
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            if (!postId) {
                return next(ApiError.badRequest("Пост не знайдено"));
            }
            await bookmarks_service.addBookmark(userId, postId)
            return res.status(200).json("Пост було успішно збережено")
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async unsavePost(req, res, next){
        try {
            const userId = req.user.id
            const {postId} = req.params
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            if (!postId) {
                return next(ApiError.badRequest("Пост не знайдено"));
            }
            await bookmarks_service.removeBookmark(userId, postId)
            return res.status(200).json("Пост видалено зі збережених")
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async clearBookmarks(req, res, next){
        try {
            const userId = req.user.id
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            await bookmarks_service.clearBookmarks(userId)
            return res.status(200).json("Збережені пости були видалені")
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new BookmarksController()