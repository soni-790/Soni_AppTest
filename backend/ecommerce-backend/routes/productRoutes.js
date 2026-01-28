const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getCategories,
    getBrands
} = require('../controllers/productController');

// @route   GET /api/products/categories
router.get('/categories', getCategories);

// @route   GET /api/products/brands
router.get('/brands', getBrands);

// @route   GET /api/products/search
router.get('/search', searchProducts);

// @route   GET /api/products/category/:category
router.get('/category/:category', getProductsByCategory);

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;
