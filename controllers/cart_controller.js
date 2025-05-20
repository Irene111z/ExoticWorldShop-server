const ApiError = require('../errors/ApiError')
const cart_service = require('../services/cart_service')

class CartController{
    async getCart(req, res, next){
        try {
            const userId = req.user.id
            const cart = await cart_service.getCart(userId)
            return res.status(200).json(cart)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async addProductToCart(req, res, next){
        try {
            const userId = req.user.id
            const {productId, quantity} = req.body
            const cart = await cart_service.addProductToCart(userId, productId, quantity || 1)
            return res.status(200).json(cart)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async deleteProductFromCart(req, res, next){
        try {
            const userId = req.user.id
            const {productId} = req.params
            console.log('Product ID:', productId);
            await cart_service.removeProductFromCart(userId, productId)
            return res.status(200).json({message:"Товар був видалений з кошику"})
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async increaseCartItem(req, res, next){
        try {
            const userId = req.user.id
            const {productId} = req.body
            const cartItem = await cart_service.incCartItem(userId, productId)
            return res.status(200).json(cartItem)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async decreaseCartItem(req, res, next){
        try {
            const userId = req.user.id
            const {productId} = req.body
            const cartItem = await cart_service.decCartItem(userId, productId)
            return res.status(200).json(cartItem)
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
    async clearCart(req, res, next){
        try {
            const userId = req.user.id
            await cart_service.clearCart(userId)
            return res.status(200).json({message:"Кошик успішно було очищено!"})
        } catch (error) {
            next(ApiError.badRequest(error.message)) 
        }
    }
}

module.exports = new CartController()