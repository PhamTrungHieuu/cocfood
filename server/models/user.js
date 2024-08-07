const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const { types } = require('util');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721211349/download_1_nmkqkr.jpg',
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String
    }],
    address: String,
    wishlist: [{
        type: mongoose.Types.ObjectId, ref: 'Product'
    }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,

    },
    passwordChangedAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    },
    registerToken: {
        type: String
    },
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        return resetToken
    }
}
//Export the model
module.exports = mongoose.model('User', userSchema);