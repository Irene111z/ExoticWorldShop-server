const Router = require('express')
const router = new Router()
const blog_controller = require('../controllers/blog_controller')
const roleControll = require('../middleware/RoleControllMiddleware')

router.post('/', roleControll('admin'), blog_controller.createPost)
router.get('/', blog_controller.getAllPosts)
router.get('/:id', blog_controller.getFullPost)
router.put('/:id', roleControll('admin'), blog_controller.editPost)
router.delete('/:id', roleControll('admin'), blog_controller.deletePost)

module.exports = router