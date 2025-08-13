# Studio Oak 🌳

Welcome to **Studio Oak**, where timeless furniture meets modern e-commerce. This is a full-stack MERN application that provides a seamless shopping experience for beautifully crafted furniture.

## ✨ Features

  - **Client-Side (Built with React & Vite):**

      - **🏡 Homepage:** A welcoming page with a main banner, featured categories, and best-selling products.
      - **🛋️ Product Listings:** View all products or browse by category.
      - **🔍 Search & Suggestions:** Find products quickly with a smart search bar that suggests items as you type.
      - **🛒 Shopping Cart:** A fully functional cart to add, remove, and update item quantities.
      - **🔐 User Authentication:** Secure user registration and login with email/password and Google OAuth. OTP verification is implemented for new user registrations to ensure valid email addresses.
      - **🏠 Address Management:** Users can add and select shipping addresses.
      - **📦 Order History:** View past orders and their status.
      - **💳 Payment Integration:** Supports Cash on Delivery (COD).
      - **📱 Responsive Design:** A beautiful and functional experience on any device.
      - **❤️ Wishlist:** Users can add and remove products from their wishlist.
      - **⭐ Product Reviews:** Customers can write reviews for products they have purchased.
      - **🤖 Chatbot:** An interactive chatbot to help users with their queries about orders, shipping, and products.
      - **❓ FAQ Page:** A comprehensive FAQ page with categorized questions and answers.

  - **Admin Panel:**

      - **🔐 Secure Login:** Separate login for administrators.
      - **➕ Add Products:** Easily add new furniture to the store with images and details.
      - **📋 Product List:** View and manage all products, including stock status, and delete products.
      - **📝 View Orders:** See all customer orders and their details, and update order status.
      - **🗣️ Support Requests:** View and manage customer support requests from the chatbot.

  - **Server-Side (Built with Node.js & Express):**

      - **🔐 Authentication & Authorization:** JWT-based authentication for users and admins.
      - **📦 API Endpoints:** A comprehensive set of APIs for managing products, users, carts, orders, reviews, and support requests.
      - **☁️ Cloud Image Uploads:** Product images are uploaded to and served from Cloudinary.
      - **🍃 MongoDB Database:** A flexible and scalable NoSQL database for all application data.

## 🛠️ Tech Stack

  - **Frontend:** React, Vite, Tailwind CSS, Axios
  - **Backend:** Node.js, Express.js
  - **Database:** MongoDB
  - **Authentication:** JWT, bcryptjs, Passport.js for Google OAuth
  - **Image Storage:** Cloudinary

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  - Node.js and npm (or yarn)
  - MongoDB account and connection URI
  - Cloudinary account credentials
  - Google OAuth credentials from the Google Cloud Console

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/studio_oak.git
    ```
2.  **Install server dependencies**
    ```sh
    cd server
    npm install
    ```
3.  **Install client dependencies**
    ```sh
    cd ../client
    npm install
    ```

### Configuration

1.  **Server Environment Variables**

    Create a `.env` file in the `server` directory and add the following:

    ```env
    # Environment
    NODE_ENV=development

    # Server Port
    PORT=4000

    # Admin Credentials
    SELLER_EMAIL=adminpanel@example.com
    SELLER_PASSWORD=admin

    # MongoDB Setup
    MONGODB_URI=your_mongodb_connection_string

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # JWT Secret
    JWT_SECRET=a_super_secret_key

    # Google OAuth
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Stripe
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # Nodemailer (for OTP emails)
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password

    # Client URL
    CLIENT_URL=http://localhost:5173
    ```

2.  **Client Environment Variables**

    Create a `.env` file in the `client` directory and add the following:

    ```env
    VITE_CURRENCY = '$'
    VITE_BACKEND_URL="http://localhost:4000"
    ```

### Running the Application

1.  **Start the server**
    ```sh
    cd server
    npm run server
    ```
2.  **Start the client**
    ```sh
    cd ../client
    npm run dev
    ```

## 📜 Available Scripts

### Client

  - `npm run dev`: Starts the development server.
  - `npm run build`: Builds the app for production.
  - `npm run lint`: Lints the code.
  - `npm run preview`: Previews the production build.

### Server

  - `npm start`: Starts the server.
  - `npm run server`: Starts the server with nodemon for development.
