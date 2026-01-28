const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const User = require('./model/User.js');
const Product = require('./model/Product.js');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db');
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Default user data
const defaultUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1-555-0100',
    image: 'https://dummyjson.com/icon/emilys/128',
    address: {
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
    },
    role: 'user'
};

// Product data (20 products across various categories)
const productsData = [
    {
        title: 'iPhone 15 Pro Max',
        description: 'The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and a 48MP camera system with 5x optical zoom. Experience the most powerful iPhone ever with exceptional battery life and stunning Super Retina XDR display.',
        category: 'smartphones',
        price: 1199.99,
        discountPercentage: 5.5,
        rating: 4.8,
        stock: 45,
        tags: ['apple', 'smartphone', 'electronics', 'premium'],
        brand: 'Apple',
        sku: 'APPL-IPH15PM-256',
        weight: 221,
        dimensions: { width: 76.7, height: 159.9, depth: 8.25 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Best phone I have ever used!', reviewerName: 'Mike Johnson', reviewerEmail: 'mike@email.com' },
            { rating: 5, comment: 'Camera quality is exceptional', reviewerName: 'Sarah Williams', reviewerEmail: 'sarah@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1592286927505-1def25115558?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=300'
    },
    {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra with AI-powered features, 200MP camera, S Pen support, and titanium frame. Features the latest Snapdragon processor and all-day battery life.',
        category: 'smartphones',
        price: 1299.99,
        discountPercentage: 8.0,
        rating: 4.7,
        stock: 38,
        tags: ['samsung', 'smartphone', 'electronics', 'android'],
        brand: 'Samsung',
        sku: 'SAMS-GS24U-256',
        weight: 232,
        dimensions: { width: 79, height: 162.3, depth: 8.6 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Amazing display and camera!', reviewerName: 'Tom Brown', reviewerEmail: 'tom@email.com' },
            { rating: 4, comment: 'Great phone, slightly heavy', reviewerName: 'Lisa Davis', reviewerEmail: 'lisa@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300'
    },
    {
        title: 'MacBook Pro 16" M3 Max',
        description: 'MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, and 1TB SSD. Features stunning Liquid Retina XDR display, up to 22 hours battery life, and professional-grade performance.',
        category: 'laptops',
        price: 3499.99,
        discountPercentage: 3.0,
        rating: 4.9,
        stock: 20,
        tags: ['apple', 'laptop', 'electronics', 'professional'],
        brand: 'Apple',
        sku: 'APPL-MBP16M3-1TB',
        weight: 2140,
        dimensions: { width: 355.7, height: 248.1, depth: 16.8 },
        warrantyInformation: '1 year AppleCare included',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Incredible performance for video editing', reviewerName: 'James Wilson', reviewerEmail: 'james@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300'
    },
    {
        title: 'Dell XPS 15 OLED',
        description: 'Dell XPS 15 with stunning 3.5K OLED display, Intel Core i9, 32GB RAM, and NVIDIA RTX 4070. Perfect for creators and professionals who demand the best.',
        category: 'laptops',
        price: 2199.99,
        discountPercentage: 10.0,
        rating: 4.6,
        stock: 25,
        tags: ['dell', 'laptop', 'electronics', 'oled'],
        brand: 'Dell',
        sku: 'DELL-XPS15-OLED',
        weight: 1860,
        dimensions: { width: 344.4, height: 230.1, depth: 18 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'OLED display is breathtaking', reviewerName: 'Emily Chen', reviewerEmail: 'emily@email.com' },
            { rating: 4, comment: 'Excellent laptop, runs a bit warm', reviewerName: 'David Kim', reviewerEmail: 'david@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300'
    },
    {
        title: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with Auto NC Optimizer, exceptional sound quality, and up to 30 hours battery life. Features multipoint connection and speak-to-chat.',
        category: 'audio',
        price: 399.99,
        discountPercentage: 15.0,
        rating: 4.8,
        stock: 60,
        tags: ['sony', 'headphones', 'electronics', 'noise-canceling'],
        brand: 'Sony',
        sku: 'SONY-WH1000XM5',
        weight: 250,
        dimensions: { width: 22.7, height: 22.9, depth: 5.3 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Best noise canceling ever!', reviewerName: 'Alex Turner', reviewerEmail: 'alex@email.com' },
            { rating: 5, comment: 'Comfortable for all-day use', reviewerName: 'Maria Garcia', reviewerEmail: 'maria@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
        description: 'AirPods Pro with Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. Features USB-C charging case with speaker and lanyard loop.',
        category: 'audio',
        price: 249.99,
        discountPercentage: 0,
        rating: 4.7,
        stock: 80,
        tags: ['apple', 'earbuds', 'electronics', 'wireless'],
        brand: 'Apple',
        sku: 'APPL-APP2-USBC',
        weight: 50.8,
        dimensions: { width: 60.6, height: 45.2, depth: 21.7 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Perfect for iPhone users', reviewerName: 'Chris Lee', reviewerEmail: 'chris@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=300'
    },
    {
        title: 'Nike Air Max 270',
        description: 'Nike Air Max 270 features the largest Max Air unit yet for a super soft ride. Mesh upper and synthetic overlays provide breathability and support.',
        category: 'footwear',
        price: 150.00,
        discountPercentage: 20.0,
        rating: 4.5,
        stock: 100,
        tags: ['nike', 'shoes', 'sneakers', 'athletic'],
        brand: 'Nike',
        sku: 'NIKE-AM270-BLK',
        weight: 300,
        dimensions: { width: 30, height: 12, depth: 10 },
        warrantyInformation: '90 days manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Most comfortable sneakers!', reviewerName: 'Ryan Martinez', reviewerEmail: 'ryan@email.com' },
            { rating: 4, comment: 'Great style, runs slightly small', reviewerName: 'Jessica White', reviewerEmail: 'jessica@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'
    },
    {
        title: 'Adidas Ultraboost 23',
        description: 'Adidas Ultraboost 23 with BOOST midsole for incredible energy return. Linear Energy Push system provides spring and support for everyday runners.',
        category: 'footwear',
        price: 190.00,
        discountPercentage: 12.0,
        rating: 4.6,
        stock: 75,
        tags: ['adidas', 'shoes', 'running', 'athletic'],
        brand: 'Adidas',
        sku: 'ADID-UB23-WHT',
        weight: 310,
        dimensions: { width: 30, height: 12, depth: 11 },
        warrantyInformation: '90 days manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Best running shoes I own', reviewerName: 'Kevin Park', reviewerEmail: 'kevin@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1605348532760-6ab7b72c6c14?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1605348532760-6ab7b72c6c14?w=300'
    },
    {
        title: 'PlayStation 5 Slim',
        description: 'PlayStation 5 Slim console with 1TB SSD, DualSense wireless controller, and Ultra HD Blu-ray drive. Experience lightning-fast loading and stunning graphics.',
        category: 'gaming',
        price: 499.99,
        discountPercentage: 0,
        rating: 4.9,
        stock: 15,
        tags: ['sony', 'gaming', 'console', 'playstation'],
        brand: 'Sony',
        sku: 'SONY-PS5S-1TB',
        weight: 3200,
        dimensions: { width: 358, height: 96, depth: 216 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'Low Stock',
        reviews: [
            { rating: 5, comment: 'Amazing gaming experience!', reviewerName: 'Daniel Harris', reviewerEmail: 'daniel@email.com' },
            { rating: 5, comment: 'Loading times are incredible', reviewerName: 'Sophie Taylor', reviewerEmail: 'sophie@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300'
    },
    {
        title: 'Xbox Series X',
        description: 'Xbox Series X delivers 12 teraflops of processing power, true 4K gaming, and up to 120fps. Features 1TB custom SSD and Xbox Velocity Architecture.',
        category: 'gaming',
        price: 499.99,
        discountPercentage: 5.0,
        rating: 4.8,
        stock: 22,
        tags: ['microsoft', 'gaming', 'console', 'xbox'],
        brand: 'Microsoft',
        sku: 'MSFT-XBSX-1TB',
        weight: 4450,
        dimensions: { width: 151, height: 301, depth: 151 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Game Pass is incredible value', reviewerName: 'Brandon Moore', reviewerEmail: 'brandon@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1538481572191-02ac73cefd4d?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1538481572191-02ac73cefd4d?w=300'
    },
    {
        title: 'Samsung 65" QLED 4K Smart TV',
        description: 'Samsung 65-inch QLED 4K Smart TV with Quantum HDR, Object Tracking Sound, and Tizen OS. Features ultra-slim design and AI-powered upscaling.',
        category: 'televisions',
        price: 1299.99,
        discountPercentage: 18.0,
        rating: 4.7,
        stock: 12,
        tags: ['samsung', 'tv', 'electronics', '4k'],
        brand: 'Samsung',
        sku: 'SAMS-QLED65-4K',
        weight: 23500,
        dimensions: { width: 1449.4, height: 829.8, depth: 26.9 },
        warrantyInformation: '2 year manufacturer warranty',
        shippingInformation: 'Ships in 5-7 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Picture quality is stunning', reviewerName: 'Amanda Clark', reviewerEmail: 'amanda@email.com' },
            { rating: 4, comment: 'Great TV, smart features could be better', reviewerName: 'Robert Lewis', reviewerEmail: 'robert@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300'
    },
    {
        title: 'LG C3 55" OLED TV',
        description: 'LG 55-inch OLED evo TV with α9 AI Processor Gen6, Dolby Vision and Dolby Atmos. Perfect blacks, infinite contrast, and cinema-quality viewing experience.',
        category: 'televisions',
        price: 1399.99,
        discountPercentage: 22.0,
        rating: 4.9,
        stock: 8,
        tags: ['lg', 'tv', 'electronics', 'oled'],
        brand: 'LG',
        sku: 'LG-OLEDC3-55',
        weight: 18000,
        dimensions: { width: 1228, height: 706, depth: 45.7 },
        warrantyInformation: '2 year manufacturer warranty',
        shippingInformation: 'Ships in 5-7 business days',
        availabilityStatus: 'Low Stock',
        reviews: [
            { rating: 5, comment: 'Best TV I have ever owned!', reviewerName: 'Nicole Adams', reviewerEmail: 'nicole@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300'
    },
    {
        title: 'Dyson V15 Detect',
        description: 'Dyson V15 Detect cordless vacuum with laser dust detection, piezo sensor, and HEPA filtration. Most powerful and intelligent Dyson vacuum yet.',
        category: 'home-appliances',
        price: 749.99,
        discountPercentage: 8.0,
        rating: 4.8,
        stock: 30,
        tags: ['dyson', 'vacuum', 'home', 'appliance'],
        brand: 'Dyson',
        sku: 'DYSON-V15-DET',
        weight: 3100,
        dimensions: { width: 25.2, height: 126.1, depth: 24.3 },
        warrantyInformation: '2 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Laser feature is game-changing', reviewerName: 'Patricia Hill', reviewerEmail: 'patricia@email.com' },
            { rating: 5, comment: 'Worth every penny', reviewerName: 'Mark Thompson', reviewerEmail: 'mark@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300'
    },
    {
        title: 'KitchenAid Stand Mixer',
        description: 'KitchenAid Artisan Series 5-Quart Stand Mixer with 10 speeds and planetary mixing action. Includes flat beater, dough hook, and wire whip.',
        category: 'home-appliances',
        price: 449.99,
        discountPercentage: 15.0,
        rating: 4.9,
        stock: 40,
        tags: ['kitchenaid', 'mixer', 'kitchen', 'appliance'],
        brand: 'KitchenAid',
        sku: 'KA-ARTISAN-5QT',
        weight: 11800,
        dimensions: { width: 22.1, height: 35.3, depth: 36.1 },
        warrantyInformation: '5 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Perfect for baking!', reviewerName: 'Linda Baker', reviewerEmail: 'linda@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1556910103-2d02b396e0f0?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1556910103-2d02b396e0f0?w=300'
    },
    {
        title: 'Apple Watch Ultra 2',
        description: 'Apple Watch Ultra 2 with precision dual-frequency GPS, 3000 nits display, and up to 72 hours battery life. Built for extreme adventures.',
        category: 'wearables',
        price: 799.99,
        discountPercentage: 0,
        rating: 4.8,
        stock: 35,
        tags: ['apple', 'watch', 'wearable', 'fitness'],
        brand: 'Apple',
        sku: 'APPL-AWU2-49MM',
        weight: 61.4,
        dimensions: { width: 49, height: 44, depth: 14.4 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Perfect for outdoor activities', reviewerName: 'Steve Rogers', reviewerEmail: 'steve@email.com' },
            { rating: 5, comment: 'Battery life is impressive', reviewerName: 'Diana Prince', reviewerEmail: 'diana@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
    },
    {
        title: 'Samsung Galaxy Watch 6',
        description: 'Samsung Galaxy Watch 6 with BioActive Sensor, advanced sleep coaching, and personalized heart rate zones. Features sapphire crystal display.',
        category: 'wearables',
        price: 329.99,
        discountPercentage: 10.0,
        rating: 4.5,
        stock: 50,
        tags: ['samsung', 'watch', 'wearable', 'fitness'],
        brand: 'Samsung',
        sku: 'SAMS-GW6-44MM',
        weight: 33.3,
        dimensions: { width: 44.4, height: 44.4, depth: 9 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 4, comment: 'Great Android watch!', reviewerName: 'Peter Parker', reviewerEmail: 'peter@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
    },
    {
        title: 'Canon EOS R6 Mark II',
        description: 'Canon EOS R6 Mark II full-frame mirrorless camera with 24.2MP sensor, up to 40fps continuous shooting, and 4K 60p video. Professional-grade autofocus system.',
        category: 'cameras',
        price: 2499.99,
        discountPercentage: 5.0,
        rating: 4.9,
        stock: 10,
        tags: ['canon', 'camera', 'mirrorless', 'photography'],
        brand: 'Canon',
        sku: 'CANON-R6M2-BODY',
        weight: 670,
        dimensions: { width: 138.4, height: 98.4, depth: 88.4 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Professional quality results', reviewerName: 'Bruce Wayne', reviewerEmail: 'bruce@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=300'
    },
    {
        title: 'Sony Alpha 7 IV',
        description: 'Sony Alpha 7 IV full-frame mirrorless camera with 33MP sensor, real-time Eye AF, and 4K 60p recording. Perfect hybrid camera for photo and video.',
        category: 'cameras',
        price: 2498.00,
        discountPercentage: 7.0,
        rating: 4.8,
        stock: 14,
        tags: ['sony', 'camera', 'mirrorless', 'photography'],
        brand: 'Sony',
        sku: 'SONY-A7IV-BODY',
        weight: 658,
        dimensions: { width: 131.3, height: 96.4, depth: 79.8 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Best hybrid camera!', reviewerName: 'Clark Kent', reviewerEmail: 'clark@email.com' },
            { rating: 5, comment: 'Autofocus is incredibly fast', reviewerName: 'Lois Lane', reviewerEmail: 'lois@email.com' }
        ],
        returnPolicy: '14 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=300'
        description: 'ASUS ROG Zephyrus G14 gaming laptop with AMD Ryzen 9, RTX 4090, 32GB RAM, and 1TB SSD. Features AniMe Matrix LED display on lid.',
        category: 'laptops',
        price: 1999.99,
        discountPercentage: 12.0,
        rating: 4.7,
        stock: 18,
        tags: ['asus', 'laptop', 'gaming', 'rog'],
        brand: 'ASUS',
        sku: 'ASUS-ZEPH-G14',
        weight: 1720,
        dimensions: { width: 312, height: 227, depth: 19.5 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 2-3 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Best portable gaming laptop', reviewerName: 'Tony Stark', reviewerEmail: 'tony@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1588872657840-790ff3a58ab7?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1588872657840-790ff3a58ab7?w=300'
        description: 'Bose QuietComfort Ultra Headphones with world-class noise cancellation, Immersive Audio, and CustomTune technology. Up to 24 hours battery life.',
        category: 'audio',
        price: 429.99,
        discountPercentage: 10.0,
        rating: 4.7,
        stock: 45,
        tags: ['bose', 'headphones', 'audio', 'noise-canceling'],
        brand: 'Bose',
        sku: 'BOSE-QCULT-BLK',
        weight: 250,
        dimensions: { width: 15.5, height: 18.4, depth: 7.7 },
        warrantyInformation: '1 year manufacturer warranty',
        shippingInformation: 'Ships in 1-2 business days',
        availabilityStatus: 'In Stock',
        reviews: [
            { rating: 5, comment: 'Incredible sound quality!', reviewerName: 'Natasha Romanoff', reviewerEmail: 'natasha@email.com' },
            { rating: 4, comment: 'Great but pricey', reviewerName: 'Clint Barton', reviewerEmail: 'clint@email.com' }
        ],
        returnPolicy: '30 days return policy',
        minimumOrderQuantity: 1,
        images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300'

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create default user
        console.log('Creating default user...');
        const user = await User.create(defaultUser);
        console.log(`Default user created: ${user.email}`);

        // Create products
        console.log('Creating products...');
        const products = await Product.insertMany(productsData);
        console.log(`${products.length} products created`);

        console.log('\n========================================');
        console.log('Database seeded successfully!');
        console.log('========================================');
        console.log('\nDefault User Credentials:');
        console.log(`Email: ${defaultUser.email}`);
        console.log(`Password: ${defaultUser.password}`);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
