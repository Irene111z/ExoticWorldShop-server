const { model } = require('../database')
const {Product, Order, OrderItem, CartItem, Cart} = require('../models/models')

class OrderRepository{
    async createOrderFromCart(userId, data){

        const {delivery_method, delivery_address, payment_method, recipient_name, recipient_lastname, recipient_phone, recipient_email, comment} = data

        if(delivery_method !== "Самовивіз" && !delivery_address){
            throw new Error('Вкажіть адресу доставки')
        }

        const cart = await Cart.findOne({where:{userId}})
        if (!cart) {
            throw new Error('Кошик не знайдений')
        }
        
        const cartItems = await CartItem.findAndCountAll({where: {cartId:cart.id}})
        if (cartItems.count === 0) {
            throw new Error('Кошик порожній')
        }

        //count total
        let total = 0
        const products = await Promise.all(cartItems.rows.map(item => Product.findByPk(item.productId)));
        for (let i=0; i<cartItems.rows.length; i++) {
            if(products[i].disc_price === null){
                total += cartItems.rows[i].quantity * products[i].price
            }
            else{
                total += cartItems.rows[i].quantity * products[i].disc_price
            }
            
        }

        //create an order
        const order = await Order.create({userId, total, delivery_method, delivery_address, payment_method, recipient_name, recipient_lastname, recipient_phone, recipient_email, comment})

        //create order items and delete this items from cart
        for(let item of cartItems.rows){
            await OrderItem.create({quantity:item.quantity, productId:item.productId, orderId:order.id})
            await item.destroy()
        }

        return order
    }
    async getUserOrders(userId){
        const orders = await Order.findAll({
            where: {userId}, 
            attributes: ['id', 'total', 'createdAt', 'status'], 
            include: [
            {
                model: OrderItem,
                attributes: ['quantity'],
                include: [
                    {
                        model: Product,
                        attributes: ['name', 'price','disc_price', 'img']
                    }
                ]
            }],
            order: [['createdAt', 'DESC']]
        })

        if(!orders){
            throw new Error("Ваша історія замовлень поки пуста.")
        }
        return orders
    }
    async cancelOrder(userId, orderId){
        const order = await Order.findOne({where:{userId:userId, id:orderId}})
        if(!order){
            throw new Error("Замовлення не знайдено")
        }
        if (["Відправлено", "Доставлено", "Скасовано"].includes(order.status)) {
            throw new Error('Скасування замовлення на даному етапі неможливе');
        }
        await order.update({ status: "Скасовано" })
    }
    async getAllOrders(){
        const orders = await Order.findAll({
            attributes: ['id', 'total', 'createdAt', 'status', 'delivery_method', 'delivery_address', 'payment_method', 'recipient_name', 'recipient_lastname', 'recipient_phone', 'recipient_email', 'comment'], 
            include: [
            {
                model: OrderItem,
                attributes: ['quantity'],
                include: [
                    {
                        model: Product,
                        attributes: ['name', 'price','disc_price', 'img']
                    }
                ]
            }],
            order: [['createdAt', 'DESC']]
        })

        if(!orders){
            throw new Error("Замовлення не знайдені")
        }
        return orders
    }
    async changeOrderStatus(orderId, status){
        const order = await Order.findOne({where:{id:orderId}})
        if(!order){
            throw new Error("Замовлення не знайдено")
        }
        await order.update({ status: status })
    }

}

module.exports = new OrderRepository()