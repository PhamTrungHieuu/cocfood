const router = require('express').Router()
const ctrls = require('../controllers/order')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
router.post('/', verifyAccessToken, ctrls.createOrder)
router.post('/now', verifyAccessToken, ctrls.createOrderNow)
router.get('/', verifyAccessToken, ctrls.getUserOrder)
router.get('/check', verifyAccessToken, ctrls.checkUserOrderProduct)

router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrders)

router.put('/status/:oid', [verifyAccessToken, isAdmin], ctrls.updateStatus)


module.exports = router