const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto')
const makeToken = require('uniquid')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    const user = await User.findOne({ email })
    if (user) {
        throw new Error('User has existed!')
    }
    else {
        const token = await makeToken()
        res.cookie('dataregister', { ...req.body, token }, {
            httpOnly: true, maxAge: 15 * 60 * 1000
        })
        const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng kí của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giới <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`
        await sendMail({ email, html, subject: 'Hoàn tất đăng ký Digital World' })
        return res.json({
            success: true,
            mes: 'Please check your email to active account'
        })
    }

})
const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    const { token } = req.params
    if (Object.keys(cookie).length === 0 || cookie.dataregister.token !== token) {
        res.clearCookie('dataregister')
        return res.redirect(`${process.env.CLIENT_URL}/register/fail`)
    }
    const newUser = await User.create({
        email: cookie?.dataregister?.email,
        password: cookie?.dataregister?.password,
        firstname: cookie?.dataregister?.firstname,
        lastname: cookie?.dataregister?.lastname,
        mobile: cookie?.dataregister?.mobile,

    })
    res.clearCookie('dataregister')
    if (newUser) {
        return res.redirect(`${process.env.CLIENT_URL}/register/success`)
    }
    else {
        return res.redirect(`${process.env.CLIENT_URL}/register/fail`)
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    }
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tao accsessToken
        const accsessToken = generateAccessToken(response._id, role)
        const newRefreshToken = generateRefreshToken(response._id)
        // luu refreshToken va0 db
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        //luu refreshToken vao cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accsessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'user not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    //Lấy token từ cookie
    const cookie = req.cookies
    // chech xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    // check xem token có khớp với token ở trong db không
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken({ _id: response._id, role: response.role }) : 'Refresh token not matched'
    })
})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giới <a href=${process.env.CLIENT_URL}/passwordreset/${resetToken}>Click here</a>`
    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})
const getUser = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})
const getUserByadmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new Error('Missing inputs')
    const response = await User.findById(uid).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} delete` : 'No user delete'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong'
    })
})
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    // { $push: { address: req.body.address } }
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity, isInput } = req.body
    if (!pid || !quantity) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if (alreadyProduct.product.toString() === pid) {
            if (isInput) {
                const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
                return res.status(200).json({
                    success: response ? true : false,
                    updateCart: response ? response : 'Something went wrong'
                })
            } else {

                const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": +quantity + +alreadyProduct.quantity } }, { new: true })
                return res.status(200).json({
                    success: response ? true : false,
                    updateCart: response ? response : 'Something went wrong'
                })
            }
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updateCart: response ? response : 'Something went wrong'
        })
    }
})
const getCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price thumb')
    return res.status(200).json({
        success: userCart ? true : false,
        dataCart: userCart ? userCart : 'Chưa có sản phẩm'
    })
})
const deleteCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.body
    const userCart = await User.findById(_id);
    userCart.cart = userCart.cart.filter(item => item.product._id.toString() !== pid);
    await userCart.save();
    return res.status(200).json({
        success: userCart ? true : false,
        deleteCart: userCart ? userCart : 'Lỗi xóa sản phẩm'
    })
})
const uploadAvatar = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!req.file) throw new Error('Missing inputs')
    const reponse = await User.findByIdAndUpdate(uid, { avatar: req.file.path }, { new: true })
    return res.status(200).json({
        success: reponse ? true : false,
        updatedProduct: reponse ? reponse : 'Cannot upload avatar user'
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUser,
    getUserByadmin,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    getCart,
    deleteCart,
    uploadAvatar,
}