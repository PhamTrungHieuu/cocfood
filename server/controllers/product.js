const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const { trusted } = require('mongoose')
const slugify = require('slugify')


const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0 || !req.files['thumb'] ) throw new Error('Missing inputs')
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
    req.body.thumb = req.files['thumb'][0].path;
    // req.body.images = req.files['images'].map((file) => file.path);  or filenames if you're saving the files to disk
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : 'Cannot get product'
    })
})
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    // Tách các trường đặc biêt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)

    // Filtering
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }
    let queryCommand = Product.find(formatedQueries)


    //sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    // Pagination
    // limit : số object lấy về 1 gọi API
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)



    // Execute query

    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message)
    //     const counts = await Product.find(formatedQueries).countDocuments()
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         products: response ? response : 'Cannot get product',
    //         counts
    //     })
    // })
    const response = await queryCommand;

    // Đếm số lượng tài liệu phù hợp
    const counts = await Product.countDocuments(formatedQueries);

    // Trả về kết quả
    return res.status(200).json({
        success: true,
        products: response,
        counts
    });
})
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot not updated product'
    })
})
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot not delete product'
    })
})
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings.find(el => el.postedBy.toString() === _id)

    if (alreadyRating) {
        // update star & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true })
    }
    else {
        // add start & comment
        const response = await Product.findByIdAndUpdate(pid, {
            $push: {
                ratings: {
                    star,
                    comment,
                    postedBy: _id
                }
            }
        }, { new: true })
    }
    // Sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10

    await updatedProduct.save();
    return res.status(200).json({
        success: true,
        updatedProduct
    })
})
const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Missing inputs')
    const reponse = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        success: reponse ? true : false,
        updatedProduct: reponse ? reponse : 'Cannot upload images product'
    })
})
const uploadThumbProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.file) throw new Error('Missing inputs')
    const reponse = await Product.findByIdAndUpdate(pid, { thumb: req.file.path }, { new: true })
    return res.status(200).json({
        success: reponse ? true : false,
        updatedProduct: reponse ? reponse : 'Cannot upload thumb product'
    })
})
const deleteImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { fileImage } = req.body; // Giả sử bạn gửi fileImage cần xóa từ client
    // Tìm sản phẩm cần cập nhật
    let product = await Product.findById(pid);

    // Lọc ra mảng images mới không bao gồm fileImage cần xóa
    product.images = product.images.filter(image => image !== fileImage);

    // Lưu sản phẩm đã cập nhật
    product = await product.save();

    return res.status(200).json({
        success: true,
        updatedProduct: product
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
    uploadThumbProduct,
    deleteImageProduct,
}