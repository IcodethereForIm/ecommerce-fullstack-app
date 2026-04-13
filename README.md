# 🛍️ Full Stack E-commerce App

## 🚀 Tech Stack
- React (Frontend)
- Laravel (Backend)
- MySQL
- Razorpay (Test Mode)

## ✨ Features
- User Authentication (Login/Register)
- Product Listing & Categories
- Admin Panel CMS (Manage Products, Categories, Assets, Page Layout)
- Site Asset Management (Dynamic banners)
- Cart & Checkout System
- Razorpay Payment Integration

## ⚙️ Setup Instructions

### Backend
cd ecom-backend
composer install
cp .env.example .env
php artisan key:generate

# Setup database
# Import your database or run migrations

php artisan serve

### Frontend
cd ecom-frontend
npm install
npm run dev

## 💳 Payment
Use Razorpay test keys in `.env`

## 📌 Notes
- Make sure backend runs on port 8000
- Images are served from Laravel storage