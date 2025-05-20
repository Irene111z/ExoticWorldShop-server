const wishlist_repository = require('../repositories/wishlist_repository')

class WishlistService{
    async getWishlist(userId){
        return await wishlist_repository.getWishlistProducts(userId)
    }
    async addProduct(userId, productId){
        return await wishlist_repository.addProduct(userId, productId)
    }
    async removeProduct(userId, productId){
        return await wishlist_repository.removeProduct(userId, productId)
    }
    async clearWishlist(userId){
        return await wishlist_repository.clearWishlist(userId)
    }
}

module.exports = new WishlistService()