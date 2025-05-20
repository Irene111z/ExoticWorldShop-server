const Router = require('express')
const router = new Router()
const author_controller = require('../controllers/author_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/', roleControll('admin'), author_controller.createAuthor)
router.get('/', author_controller.getAllAuthors)
router.delete('/:id', roleControll('admin'), author_controller.deleteAuthor)
router.put('/:id', roleControll('admin'), author_controller.editAuthor)
router.get('/:id', author_controller.getAuthorById)

module.exports = router