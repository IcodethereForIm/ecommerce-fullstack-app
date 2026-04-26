# 🛍️ Full Stack E-commerce Platform

## 🌐 Live Demo
Frontend: https://ecommerce-fullstack-app-alpha.vercel.app  
Backend: https://ecommerce-fullstack-app-production-ca91.up.railway.app

## 🚀 Tech Stack
- Frontend: React
- Backend: Laravel (REST API)
- Database: MySQL
- Cloud: Cloudinary (image storage)
- Payments: Razorpay (Test Mode)
- Deployment: Vercel (Frontend), Railway (Backend)

---

## ✨ Features
- User Authentication (Laravel Sanctum, role-based access: admin/user)
- Product Listing, Categories & Collections
- Dynamic CMS-based Homepage, Category & Collection Pages
- Admin Panel for product management (CRUD, inventory, listings)
- Site Asset Management (hero banners, promotional sections)
- Image Upload & Management via Cloudinary CDN
- Cart & Checkout System
- Razorpay Payment Integration (test mode)

---

## ⚙️ Setup Instructions

### 🔹 Backend
cd ecom-backend  
composer install  
cp .env.example .env  
php artisan key:generate  

# Configure database in .env  
php artisan migrate  

php artisan serve  

---

### 🔹 Frontend
cd ecom-frontend  
npm install  
npm run dev  

---

## 🔐 Environment Variables

### Backend (.env)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- RAZORPAY_KEY
- RAZORPAY_SECRET
- DB_DATABASE, DB_USERNAME, DB_PASSWORD

---

## 💳 Payment
Use Razorpay test keys for checkout simulation.

---

## 📌 Notes
- Backend runs on port 8000 (local)
- Images are stored and served via Cloudinary (not local storage)
- Ensure CORS and environment variables are properly configured for production

---

## 📁 Repository
https://github.com/IcodethereForIm/ecommerce-fullstack-app