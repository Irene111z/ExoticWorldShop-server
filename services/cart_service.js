const cart_repository = require('../repositories/cart_repository')

class CartService{
    async getCart(userId){
        return await cart_repository.getCartProducts(userId)
    }
    async addProductToCart(userId, productId, quantity = 1){
        const cart = await cart_repository.getCartByUserId(userId)
        await cart_repository.addCartItem(cart.id, productId, quantity)
        return await cart_repository.getCartProducts(userId)
    }
    async removeProductFromCart(userId, productId){
        const cart = await cart_repository.getCartByUserId(userId)
        await cart_repository.deleteCartItem(cart.id, productId)
        return await cart_repository.getCartProducts(userId)
    }
    async incCartItem(userId, productId){
        const cart = await cart_repository.getCartByUserId(userId)
        await cart_repository.incCartItem(cart.id, productId)
        return await cart_repository.getCartProducts(userId)
    }
    async decCartItem(userId, productId){
       const cart = await cart_repository.getCartByUserId(userId)
       await cart_repository.decCartItem(cart.id, productId)
       return await cart_repository.getCartProducts(userId)
    }
    async clearCart(userId){
        const cart = await cart_repository.getCartByUserId(userId)
        await cart_repository.clearCart(cart.id)
        return await cart_repository.getCartProducts(userId)
    }
}

module.exports = new CartService()