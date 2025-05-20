const Router = require('express')
const router = new Router()
const category_controller = require('../controllers/category_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/', roleControll('admin'), category_controller.createCategory)
router.get('/', category_controller.getAllCategories)
router.get('/:parentId/subcategories', category_controller.getSubcategories);
router.delete('/:id', roleControll('admin'), category_controller.deleteCategory)
router.put('/:id', roleControll('admin'), category_controller.updateCategory)

module.exports = router