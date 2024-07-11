const userRouter = require('./user')
const productRouter = require('./product')
const productCategoryRouter = require('./productCategory')
const blogCategoryRouter = require('./blogCategory')
const blogRouter = require('./blog')
const brandRouter = require('./brand')
const couponRouter = require('./coupon')
const oderRouter = require('./order')
const { notFound, errhandler } = require('../middlewares/errHandler')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/prodcategory', productCategoryRouter)
    app.use('/api/blogcategory', blogCategoryRouter)
    app.use('/api/blog', blogRouter)
    app.use('/api/coupon', couponRouter)
    app.use('/api/order', oderRouter)




    app.use(notFound)
    app.use(errhandler)
}

module.exports = initRoutes