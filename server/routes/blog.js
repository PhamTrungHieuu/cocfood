const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/', ctrls.getBlogs)


router.put('/image/:bid', [verifyAccessToken,isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.disLikeBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)


module.exports = router