const Router = require('express')
const router = new Router()
const wishlist_controller = require('../controllers/wishlist_controller')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.get('/', AuthorizationMiddleware, wishlist_controller.getWishlist)
router.post('/product', AuthorizationMiddleware, wishlist_controller.addProductToWishlist)
router.delete('/product/:productId', AuthorizationMiddleware, wishlist_controller.deleteProductFromWishlist)
router.delete('/', AuthorizationMiddleware, wishlist_controller.clearWishlist)

module.exports = router