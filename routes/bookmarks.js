const Router = require('express')
const router = new Router()
const bookmarks_controller = require('../controllers/bookmarks_controller')
const AuthorizationMiddleware = require('../middleware/AuthorizationMiddleware')

router.get('/', AuthorizationMiddleware, bookmarks_controller.getBookmarks)
router.post('/post', AuthorizationMiddleware, bookmarks_controller.savePost)
router.delete('/post/:postId', AuthorizationMiddleware, bookmarks_controller.unsavePost)
router.delete('/', AuthorizationMiddleware, bookmarks_controller.clearBookmarks)

module.exports = router