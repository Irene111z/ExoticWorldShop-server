const Router = require('express')
const router = new Router()
const product_controller = require('../controllers/product_controller')
const roleControll = require('../middleware/RoleControllMiddleware')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.post('/', roleControll('admin'), product_controller.createProduct)
router.get('/', product_controller.getAllProducts)

router.get('/:id', product_controller.getProduct)
router.delete('/:id', roleControll('admin'), product_controller.deleteProduct)
router.put('/:id', roleControll('admin'), product_controller.changeProduct)

router.get('/search', product_controller.searchProductByName)

router.get('/:id/reviews', product_controller.getProductReviews)
router.post('/:id/reviews', AuthorizationMiddleware, product_controller.createProductReview)
router.delete('/reviews/:id', AuthorizationMiddleware, product_controller.deleteProductReview)

router.post('/by-ids', product_controller.getProductsByIds);

module.exports = router