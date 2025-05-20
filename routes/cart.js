const Router = require('express')
const router = new Router()
const cart_controller = require('../controllers/cart_controller')
const roleControll = require('../middleware/RoleControllMiddleware')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.get('/', AuthorizationMiddleware, cart_controller.getCart)
router.post('/item', AuthorizationMiddleware, cart_controller.addProductToCart)
router.delete('/item/:productId', AuthorizationMiddleware, cart_controller.deleteProductFromCart)
router.put('/incItem', AuthorizationMiddleware, cart_controller.increaseCartItem)
router.put('/decItem', AuthorizationMiddleware, cart_controller.decreaseCartItem)
router.delete('/', AuthorizationMiddleware, cart_controller.clearCart)

module.exports = router