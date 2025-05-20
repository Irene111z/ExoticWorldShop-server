const {Product, Wishlist} = require('../models/models')

class WishlistRepository{
    async getWishlistProducts(userId){
        const wishlist = await Wishlist.findAndCountAll({ where: { userId }});
        if (!wishlist) {
            throw new Error("Списку бажань не знайдено");
        }
        return wishlist
    }
    async addProduct(userId, productId){
        const product = await Product.findByPk(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        const wishlistProduct = await Wishlist.findOne({where:{userId, productId}})
        if(wishlistProduct){
            throw new Error("Товар вже додано до списку бажань")
        }
        return await Wishlist.create({userId, productId})
    }
    async removeProduct(userId, productId){
        const product = await Product.findByPk(productId)
        if(!product){
            throw new Error("Товар не знайдено")
        }
        const wishlistProduct = await Wishlist.findOne({where:{userId, productId}})
        if(!wishlistProduct){
            throw new Error("Товар не знайдено в списку бажань")
        }
        return await Wishlist.destroy({ where: { userId, productId } });
    }
    async clearWishlist(userId){
        await Wishlist.destroy({ where: { userId }});
    }
}

module.exports = new WishlistRepository()