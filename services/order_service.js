const order_repository = require("../repositories/order_repository")

class OrderService{
    async createOrder(userId, data){
        return await order_repository.createOrderFromCart(userId, data)
    }
    async getUserOrders(userId){
        return await order_repository.getUserOrders(userId)
    }
    async cancelOrder(userId, orderId){
        return await order_repository.cancelOrder(userId, orderId)
    }
    async getAllOrders(){
        return await order_repository.getAllOrders()
    }
    async changeOrderStatus(orderId, status){
        return await order_repository.changeOrderStatus(orderId, status)
    }
}

module.exports = new OrderService()