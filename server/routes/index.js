const userRouter = require('./user')
const { notFound, errhandler } = require('../middlewares/errHandler')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)



    app.use(notFound)
    app.use(errhandler)
}

module.exports = initRoutes