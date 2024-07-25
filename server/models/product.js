const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    thumb: {
        type: String,
        default: 'https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721360253/Remove-bg.ai_1721360236950_mzrsob.png',
    },
    images: {
        type: Array,
        default: ["https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721360253/Remove-bg.ai_1721360236950_mzrsob.png"],

    },
    sale: {
        type: String,
        default: 0
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);