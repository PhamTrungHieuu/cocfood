const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloundinary.config')
//, { name: 'images', maxCount: 10 }
router.post('/', [verifyAccessToken, isAdmin], uploader.fields([{ name: 'thumb', maxCount: 1 }]), ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings', verifyAccessToken, ctrls.ratings)


router.put('/uploadthumb/:pid', [verifyAccessToken, isAdmin], uploader.single('thumb'), ctrls.uploadThumbProduct)
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), ctrls.uploadImagesProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.delete('/images/:pid', [verifyAccessToken, isAdmin], ctrls.deleteImageProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)

module.exports = router