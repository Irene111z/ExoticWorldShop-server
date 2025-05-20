const { Product, Cart, CartItem, ProductImage } = require('../models/models')

class CartRepository {
    async createCart(userId) {
        return await Cart.create({ userId });
    }
    async getCartProducts(userId) {
        return await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Product,
                            include: [
                                {
                                    model: ProductImage,
                                    as: 'images',
                                    where: { isPreview: true },
                                    required: false,
                                    limit: 1
                                }
                            ]
                        }
                    ],
                },
            ],
        })
    }

    async getCartByUserId(userId) {
        return await Cart.findOne({ where: { userId } })
    }
    async addCartItem(cartId, productId, quantity) {
        const cartItem = await CartItem.findOne({ where: { cartId, productId } })
        const product = await Product.findOne({ where: { id: productId } })
        quantity = Number(quantity)
        if (!product) {
            throw new Error("Товар не знайдено")
        }
        if (product.quantity < quantity) {
            throw new Error(`Недостатньо товару на складі, усього залишилося ${product.quantity} од.`);
        }
        if (cartItem) {
            const currentQuantity = cartItem.quantity;
            const newQuantity = currentQuantity + quantity;
            console.log('Нова кількість товару в кошику:', newQuantity);
            if (product.quantity < newQuantity) {
                throw new Error('Недостатньо товару на складі');
            }
            cartItem.quantity = newQuantity;
            await cartItem.save();
        }
        else {
            await CartItem.create({ cartId, productId, quantity })
        }
    }
    async deleteCartItem(cartId, productId) {
        await CartItem.destroy({ where: { cartId, productId } })
    }
    async incCartItem(cartId, productId) {
        const cartItem = await CartItem.findOne({ where: { cartId, productId } })
        if (!cartItem) {
            throw new Error("Товару немає в кошику")
        }
        const product = await Product.findOne({ where: { id: productId } });
        if (product.quantity <= cartItem.quantity) {
            throw new Error('Недостатньо товару на складі');
        }
        cartItem.quantity += 1
        await cartItem.save()
    }
    async decCartItem(cartId, productId) {
        const cartItem = await CartItem.findOne({ where: { cartId, productId } })
        if (!cartItem) {
            throw new Error("Товару немає в кошику")
        }
        if (cartItem.quantity <= 1) {
            await cartItem.destroy();
        }
        else {
            cartItem.quantity -= 1
            await cartItem.save()
        }

    }
    async clearCart(cartId) {
        await CartItem.destroy({ where: { cartId } });
    }
}

module.exports = new CartRepository()