const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    reviewerName: {
        type: String,
        required: true
    },
    reviewerEmail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    brand: {
        type: String,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
        depth: { type: Number, min: 0 }
    },
    warrantyInformation: {
        type: String,
        default: 'No warranty'
    },
    shippingInformation: {
        type: String,
        default: 'Ships in 3-5 business days'
    },
    availabilityStatus: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    reviews: [reviewSchema],
    returnPolicy: {
        type: String,
        default: '30 days return policy'
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    meta: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        barcode: { type: String },
        qrCode: { type: String }
    },
    images: [{
        type: String
    }],
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required']
    }
});

// Update meta.updatedAt on save
productSchema.pre('save', function() {
    this.meta.updatedAt = Date.now();
});

// Create text index for search
productSchema.index({ title: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
