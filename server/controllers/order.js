const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon } = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price sale')
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
    }))
    let total = userCart?.cart?.reduce((sum, el) => el.product.price * (1 - el.product.sale / 100) * el.quantity + sum, 0)
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon.discount / 100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const createData = { products, total, orderBy: _id }
    const rs = await Order.create(createData)
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    })
})
const createOrderNow = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { quantity , pid ,coupon } = req.body
    const product = await Product.findById(pid)
    const products = {
        product: product._id,
        count: quantity,
    }
    let total =  product.price * (1 - product.sale / 100) * quantity 
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total * (1 - +selectedCoupon.discount / 100) / 1000) * 1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const createData = { products, total, orderBy: _id }
    const rs = await Order.create(createData)
    return res.json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    })
})
const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { status } = req.query
    if (!status) throw new Error('Missing status')
    const response = await Order.find({ orderBy: _id, status }).populate('products.product', 'title thumb').populate('orderBy', 'firstname lastname')
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['firstname']
    excludeFields.forEach(el => delete queries[el])
    let queryString = JSON.stringify(queries)
    const formatedQueries = JSON.parse(queryString)
    if (queries.status) formatedQueries.status = { $regex: queries.status.toString(), $options: 'i' }
    let queryCommand = Order.find(formatedQueries).populate('products.product', 'title thumb').populate('orderBy', 'firstname lastname')
    let response = await queryCommand
    const firstname = req.query.firstname;
    if (firstname) {
        const regex = new RegExp(firstname, 'i'); // 'i' để không phân biệt hoa thường
        response = response.filter(order => regex.test(order.orderBy.firstname));
    }

    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const checkUserOrderProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid } = req.query
    if (!pid) throw new Error('Missing status')
    const response = await Order.findOne({
        orderBy: _id,
        status: 'Succeed',
        'products.product': pid
    });
    return res.json({
        success: response ? true : false,
    })
})
module.exports = {
    createOrder,
    createOrderNow,
    updateStatus,
    getUserOrder,
    getOrders,
    checkUserOrderProduct,
}