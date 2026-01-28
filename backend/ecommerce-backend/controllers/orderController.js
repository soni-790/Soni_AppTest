const Order = require('../model/Order');
const Product = require('../model/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide products to order'
            });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
            !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({
                success: false,
                message: 'Please provide complete shipping address'
            });
        }

        // Validate payment method
        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Please provide payment method'
            });
        }

        // Calculate order items and totals
        let orderProducts = [];
        let subtotal = 0;
        let discountedTotal = 0;
        let totalQuantity = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.title}. Available: ${product.stock}`
                });
            }

            const itemPrice = product.price;
            const discountedPrice = itemPrice * (1 - product.discountPercentage / 100);
            const total = discountedPrice * item.quantity;

            orderProducts.push({
                product: product._id,
                title: product.title,
                price: itemPrice,
                quantity: item.quantity,
                thumbnail: product.thumbnail,
                discountPercentage: product.discountPercentage,
                discountedPrice: discountedPrice,
                total: total
            });

            subtotal += itemPrice * item.quantity;
            discountedTotal += total;
            totalQuantity += item.quantity;

            // Update product stock
            product.stock -= item.quantity;
            if (product.stock === 0) {
                product.availabilityStatus = 'Out of Stock';
            } else if (product.stock < 10) {
                product.availabilityStatus = 'Low Stock';
            }
            await product.save();
        }

        // Calculate shipping and tax
        const shippingCost = discountedTotal > 100 ? 0 : 10;
        const tax = discountedTotal * 0.08; // 8% tax
        const grandTotal = discountedTotal + shippingCost + tax;

        // Calculate estimated delivery (5-7 days from now)
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5);

        // Create order
        const order = await Order.create({
            user: req.user.id,
            products: orderProducts,
            totalProducts: orderProducts.length,
            totalQuantity: totalQuantity,
            subtotal: subtotal,
            discountedTotal: discountedTotal,
            shippingCost: shippingCost,
            tax: tax,
            grandTotal: grandTotal,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod: paymentMethod,
            notes: notes,
            estimatedDelivery: estimatedDelivery
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = { user: req.user.id };

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders: orders,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get order status
// @route   GET /api/orders/:id/status
// @access  Private
const getOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('status paymentStatus trackingNumber estimatedDelivery deliveredAt');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                status: order.status,
                paymentStatus: order.paymentStatus,
                trackingNumber: order.trackingNumber,
                estimatedDelivery: order.estimatedDelivery,
                deliveredAt: order.deliveredAt
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns the order
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Check if order can be cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        // Restore product stock
        for (const item of order.products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                if (product.stock > 0) {
                    product.availabilityStatus = product.stock < 10 ? 'Low Stock' : 'In Stock';
                }
                await product.save();
            }
        }

        // Update order
        order.status = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancellationReason = reason || 'Cancelled by user';
        
        if (order.paymentStatus === 'paid') {
            order.paymentStatus = 'refunded';
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        if (status) order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrderStatus,
    cancelOrder,
    updateOrderStatus
};
