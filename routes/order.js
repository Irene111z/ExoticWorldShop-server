const Router = require('express')
const router = new Router()
const order_controller = require('../controllers/order_controller')
const roleControll = require('../middleware/RoleControllMiddleware')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.post('/', AuthorizationMiddleware, order_controller.createOrder)
router.get('/', AuthorizationMiddleware, order_controller.getUserOrders)
router.patch('/:id/cancel', AuthorizationMiddleware, order_controller.cancelOrder)
router.patch('/:id/status', roleControll('admin'), order_controller.changeOrderStatus)
router.get('/all', roleControll('admin'), order_controller.getAllOrders)

module.exports = router