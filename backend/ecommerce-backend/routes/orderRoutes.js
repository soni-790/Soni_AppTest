const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrderStatus,
    cancelOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { strictLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(protect);

// @route   POST /api/orders
router.post('/', strictLimiter, createOrder);

// @route   GET /api/orders
router.get('/', getMyOrders);

// @route   GET /api/orders/:id
router.get('/:id', getOrderById);

// @route   GET /api/orders/:id/status
router.get('/:id/status', getOrderStatus);

// @route   PUT /api/orders/:id/cancel
router.put('/:id/cancel', cancelOrder);

// @route   PUT /api/orders/:id/status (Admin only)
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
