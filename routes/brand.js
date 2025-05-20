const Router = require('express')
const router = new Router()
const brand_controller = require('../controllers/brand_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/', roleControll('admin'), brand_controller.createBrand)
router.get('/', brand_controller.getAllBrands)
router.delete('/:id', roleControll('admin'), brand_controller.deleteBrand)

module.exports = router