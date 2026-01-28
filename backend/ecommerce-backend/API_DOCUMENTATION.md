# E-Commerce Backend API Documentation

## Overview

This is a RESTful API for an e-commerce application. The API provides endpoints for user authentication, product management, and order processing.

**Base URL:** `http://localhost:5000/api`

**Default Test User:**
- Email: `john.doe@example.com`
- Password: `password123`

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
```bash
cd ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes
- **Authentication:** 10 requests per hour
- **Order Creation:** 10 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

---

## API Endpoints

### Health Check

#### Check API Status
```
GET /health
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "E-commerce API is running",
    "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### Register User

```
POST /api/auth/register
```

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1-555-0100",
    "address": {
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "United States"
    }
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-0100",
        "image": "https://dummyjson.com/icon/emilys/128",
        "address": {
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "United States"
        },
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Responses:**
- `400 Bad Request`: User with this email already exists
- `400 Bad Request`: Validation error (missing required fields)
- `500 Internal Server Error`: Server error

---

### Login User

```
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0100",
        "image": "https://dummyjson.com/icon/emilys/128",
        "address": {
            "address": "123 Main Street",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "United States"
        },
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Responses:**
- `400 Bad Request`: Please provide email and password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### Get Current User

```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0100",
        "image": "https://dummyjson.com/icon/emilys/128",
        "address": {
            "address": "123 Main Street",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "United States"
        },
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authorized, no token provided
- `401 Unauthorized`: Not authorized, token invalid or expired

---

### Refresh Token

```
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

## User Profile Endpoints

### Get User Profile

```
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0100",
        "image": "https://dummyjson.com/icon/emilys/128",
        "address": {
            "address": "123 Main Street",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "United States"
        },
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

---

### Update User Profile

```
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "firstName": "Johnny",
    "lastName": "Doe",
    "phone": "+1-555-0200",
    "image": "https://example.com/new-avatar.jpg",
    "address": {
        "address": "456 Oak Avenue",
        "city": "Los Angeles",
        "state": "CA",
        "postalCode": "90001",
        "country": "United States"
    }
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Johnny",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0200",
        "image": "https://example.com/new-avatar.jpg",
        "address": {
            "address": "456 Oak Avenue",
            "city": "Los Angeles",
            "state": "CA",
            "postalCode": "90001",
            "country": "United States"
        },
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T12:00:00.000Z"
    }
}
```

---

### Update Password

```
PUT /api/users/password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Please provide current password and new password
- `400 Bad Request`: New password must be at least 6 characters
- `401 Unauthorized`: Current password is incorrect

---

### Delete Account

```
DELETE /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```

---

## Product Endpoints

### Get All Products

```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| category | string | Filter by category |
| brand | string | Filter by brand |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| inStock | boolean | Filter in-stock items only |
| search | string | Search in title/description |
| sortBy | string | Sort field (e.g., "price", "-price", "rating") |

**Example:**
```
GET /api/products?page=1&limit=10&category=smartphones&minPrice=500&maxPrice=1500&sortBy=-rating
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "_id": "507f1f77bcf86cd799439011",
                "title": "iPhone 15 Pro Max",
                "description": "The iPhone 15 Pro Max features...",
                "category": "smartphones",
                "price": 1199.99,
                "discountPercentage": 5.5,
                "rating": 4.8,
                "stock": 45,
                "tags": ["apple", "smartphone", "electronics", "premium"],
                "brand": "Apple",
                "sku": "APPL-IPH15PM-256",
                "weight": 221,
                "dimensions": {
                    "width": 76.7,
                    "height": 159.9,
                    "depth": 8.25
                },
                "warrantyInformation": "1 year manufacturer warranty",
                "shippingInformation": "Ships in 1-2 business days",
                "availabilityStatus": "In Stock",
                "returnPolicy": "14 days return policy",
                "minimumOrderQuantity": 1,
                "images": ["https://cdn.dummyjson.com/products/images/..."],
                "thumbnail": "https://cdn.dummyjson.com/products/images/..."
            }
        ],
        "pagination": {
            "total": 20,
            "page": 1,
            "limit": 10,
            "totalPages": 2,
            "hasNextPage": true,
            "hasPrevPage": false
        }
    }
}
```

---

### Get Single Product

```
GET /api/products/:id
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "iPhone 15 Pro Max",
        "description": "The iPhone 15 Pro Max features...",
        "category": "smartphones",
        "price": 1199.99,
        "discountPercentage": 5.5,
        "rating": 4.8,
        "stock": 45,
        "tags": ["apple", "smartphone", "electronics", "premium"],
        "brand": "Apple",
        "sku": "APPL-IPH15PM-256",
        "weight": 221,
        "dimensions": {
            "width": 76.7,
            "height": 159.9,
            "depth": 8.25
        },
        "warrantyInformation": "1 year manufacturer warranty",
        "shippingInformation": "Ships in 1-2 business days",
        "availabilityStatus": "In Stock",
        "reviews": [
            {
                "rating": 5,
                "comment": "Best phone I have ever used!",
                "reviewerName": "Mike Johnson",
                "reviewerEmail": "mike@email.com",
                "date": "2026-01-15T10:00:00.000Z"
            }
        ],
        "returnPolicy": "14 days return policy",
        "minimumOrderQuantity": 1,
        "meta": {
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-27T10:00:00.000Z"
        },
        "images": ["https://cdn.dummyjson.com/products/images/..."],
        "thumbnail": "https://cdn.dummyjson.com/products/images/..."
    }
}
```

**Error Responses:**
- `404 Not Found`: Product not found

---

### Get Products by Category

```
GET /api/products/category/:category
```

**Example:**
```
GET /api/products/category/smartphones?page=1&limit=10
```

**Response:** Same format as Get All Products

---

### Search Products

```
GET /api/products/search?q=<query>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (required) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Example:**
```
GET /api/products/search?q=iphone&page=1&limit=10
```

**Response:** Same format as Get All Products

**Error Responses:**
- `400 Bad Request`: Search query is required

---

### Get All Categories

```
GET /api/products/categories
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        "smartphones",
        "laptops",
        "audio",
        "footwear",
        "gaming",
        "televisions",
        "home-appliances",
        "wearables",
        "cameras"
    ]
}
```

---

### Get All Brands

```
GET /api/products/brands
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        "Apple",
        "Samsung",
        "Sony",
        "Dell",
        "Nike",
        "Adidas",
        "Microsoft",
        "LG",
        "Dyson",
        "Canon"
    ]
}
```

---

## Order Endpoints

### Create Order

```
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "products": [
        {
            "productId": "507f1f77bcf86cd799439011",
            "quantity": 2
        },
        {
            "productId": "507f1f77bcf86cd799439012",
            "quantity": 1
        }
    ],
    "shippingAddress": {
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "United States"
    },
    "billingAddress": {
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "United States"
    },
    "paymentMethod": "card",
    "notes": "Please leave at door"
}
```

**Payment Methods:** `card`, `paypal`, `cash_on_delivery`, `bank_transfer`

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "user": "507f1f77bcf86cd799439011",
        "products": [
            {
                "product": "507f1f77bcf86cd799439011",
                "title": "iPhone 15 Pro Max",
                "price": 1199.99,
                "quantity": 2,
                "thumbnail": "https://...",
                "discountPercentage": 5.5,
                "discountedPrice": 1133.99,
                "total": 2267.98
            }
        ],
        "totalProducts": 2,
        "totalQuantity": 3,
        "subtotal": 3499.98,
        "discountedTotal": 3307.47,
        "shippingCost": 0,
        "tax": 264.60,
        "grandTotal": 3572.07,
        "status": "pending",
        "paymentMethod": "card",
        "paymentStatus": "pending",
        "shippingAddress": {
            "address": "123 Main Street",
            "city": "New York",
            "state": "NY",
            "postalCode": "10001",
            "country": "United States"
        },
        "estimatedDelivery": "2026-02-03T10:00:00.000Z",
        "createdAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `400 Bad Request`: Please provide products to order
- `400 Bad Request`: Please provide complete shipping address
- `400 Bad Request`: Please provide payment method
- `400 Bad Request`: Insufficient stock for product
- `404 Not Found`: Product not found

---

### Get My Orders

```
GET /api/orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status |

**Order Statuses:** `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "orders": [
            {
                "_id": "507f1f77bcf86cd799439099",
                "products": [...],
                "totalProducts": 2,
                "totalQuantity": 3,
                "grandTotal": 3572.07,
                "status": "pending",
                "paymentStatus": "pending",
                "createdAt": "2026-01-27T10:00:00.000Z"
            }
        ],
        "pagination": {
            "total": 5,
            "page": 1,
            "limit": 10,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

---

### Get Order by ID

```
GET /api/orders/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "user": {
            "_id": "507f1f77bcf86cd799439011",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com"
        },
        "products": [
            {
                "product": "507f1f77bcf86cd799439011",
                "title": "iPhone 15 Pro Max",
                "price": 1199.99,
                "quantity": 2,
                "thumbnail": "https://...",
                "discountPercentage": 5.5,
                "discountedPrice": 1133.99,
                "total": 2267.98
            }
        ],
        "totalProducts": 1,
        "totalQuantity": 2,
        "subtotal": 2399.98,
        "discountedTotal": 2267.98,
        "shippingCost": 0,
        "tax": 181.44,
        "grandTotal": 2449.42,
        "status": "pending",
        "paymentMethod": "card",
        "paymentStatus": "pending",
        "shippingAddress": {...},
        "billingAddress": {...},
        "estimatedDelivery": "2026-02-03T10:00:00.000Z",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to access this order
- `404 Not Found`: Order not found

---

### Get Order Status

```
GET /api/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "status": "shipped",
        "paymentStatus": "paid",
        "trackingNumber": "TRK123456789",
        "estimatedDelivery": "2026-02-03T10:00:00.000Z",
        "deliveredAt": null
    }
}
```

---

### Cancel Order

```
PUT /api/orders/:id/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "reason": "Changed my mind"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Order cancelled successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "status": "cancelled",
        "cancelledAt": "2026-01-27T12:00:00.000Z",
        "cancellationReason": "Changed my mind",
        "paymentStatus": "refunded"
    }
}
```

**Error Responses:**
- `400 Bad Request`: Cannot cancel order with status: shipped/delivered/cancelled
- `403 Forbidden`: Not authorized to cancel this order
- `404 Not Found`: Order not found

---

### Update Order Status (Admin Only)

```
PUT /api/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
    "status": "shipped",
    "trackingNumber": "TRK123456789"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Order status updated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "status": "shipped",
        "trackingNumber": "TRK123456789"
    }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid status value
- `403 Forbidden`: Access denied. Admin privileges required.
- `404 Not Found`: Order not found

---

## Error Response Format

All error responses follow this format:

```json
{
    "success": false,
    "message": "Error description here"
}
```

---

## Status Codes Summary

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Data Models

### User
```json
{
    "firstName": "string (required)",
    "lastName": "string (required)",
    "email": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "phone": "string",
    "image": "string (URL)",
    "address": {
        "address": "string",
        "city": "string",
        "state": "string",
        "postalCode": "string",
        "country": "string"
    },
    "role": "user | admin"
}
```

### Product
```json
{
    "title": "string (required)",
    "description": "string (required)",
    "category": "string (required)",
    "price": "number (required)",
    "discountPercentage": "number (0-100)",
    "rating": "number (0-5)",
    "stock": "number (required)",
    "tags": "array of strings",
    "brand": "string",
    "sku": "string (required, unique)",
    "weight": "number",
    "dimensions": {
        "width": "number",
        "height": "number",
        "depth": "number"
    },
    "warrantyInformation": "string",
    "shippingInformation": "string",
    "availabilityStatus": "In Stock | Low Stock | Out of Stock",
    "reviews": "array of review objects",
    "returnPolicy": "string",
    "minimumOrderQuantity": "number",
    "images": "array of URLs",
    "thumbnail": "string (URL, required)"
}
```

### Order
```json
{
    "user": "ObjectId (required)",
    "products": "array of order items",
    "totalProducts": "number",
    "totalQuantity": "number",
    "subtotal": "number",
    "discountedTotal": "number",
    "shippingCost": "number",
    "tax": "number",
    "grandTotal": "number",
    "status": "pending | confirmed | processing | shipped | delivered | cancelled",
    "paymentMethod": "card | paypal | cash_on_delivery | bank_transfer",
    "paymentStatus": "pending | paid | failed | refunded",
    "shippingAddress": "address object (required)",
    "billingAddress": "address object",
    "notes": "string",
    "trackingNumber": "string",
    "estimatedDelivery": "date",
    "deliveredAt": "date",
    "cancelledAt": "date",
    "cancellationReason": "string"
}
```
