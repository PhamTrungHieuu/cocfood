const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
router.post('/register', ctrls.register)
router.get('/finalregister/:token', ctrls.finalRegister)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUser)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.get('/cart', [verifyAccessToken], ctrls.getCart)
router.delete('/cart', [verifyAccessToken], ctrls.deleteCart)


router.put('/current', [verifyAccessToken], ctrls.updateUser)
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)

module.exports = router