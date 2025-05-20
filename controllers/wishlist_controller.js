const ApiError = require('../errors/ApiError')
const { query } = require('../database')
const wishlist_service = require('../services/wishlist_service')

class WishlistController{
    async getWishlist(req, res, next){
        try {
            const userId = req.user.id
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            const wishlist = await wishlist_service.getWishlist(userId)
            return res.status(200).json(wishlist)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async addProductToWishlist(req, res, next){
        try {
            const userId = req.user.id
            const productId = req.body.productId
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            if (!productId) {
                return next(ApiError.badRequest("Відсутній productId"));
            }
            const wishlist = await wishlist_service.addProduct(userId, productId)
            return res.status(200).json(wishlist)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async deleteProductFromWishlist(req, res, next){
        try {
            const userId = req.user.id
            const {productId} = req.params
            if (!userId) {
                return next(ApiError.badRequest("Відсутній userId"));
            }
            if (!productId) {
                return next(ApiError.badRequest("Відсутній productId"));
            }
            const wishlist = await wishlist_service.removeProduct(userId, productId)
            return res.status(200).json(wishlist)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async clearWishlist(req, res, next){
        try {
            const userId = req.user.id
            if (!userId) {
                return next(ApiError.badRequest("Користувача не знайдено"));
            }
            await wishlist_service.clearWishlist(userId)
            return res.status(200).json("Список бажань очищено")
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new WishlistController()