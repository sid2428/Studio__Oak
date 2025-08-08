# Studio Oak 🌳

Welcome to **Studio Oak**, where timeless furniture meets modern e-commerce. This is a full-stack MERN application that provides a seamless shopping experience for beautifully crafted furniture.

## ✨ Features

  - **Client-Side (Built with React & Vite):**

      - **🏡 Homepage:** A welcoming page with a main banner, featured categories, and best-selling products.
      - **🛋️ Product Listings:** View all products or browse by category.
      - **🔍 Search & Suggestions:** Find products quickly with a smart search bar that suggests items as you type.
      - **🛒 Shopping Cart:** A fully functional cart to add, remove, and update item quantities.
      - **🔐 User Authentication:** Secure user registration and login.
      - **🏠 Address Management:** Users can add and select shipping addresses.
      - **📦 Order History:** View past orders and their status.
      - **💳 Payment Integration:** Supports both Cash on Delivery (COD) and online payments via Stripe.
      - **📱 Responsive Design:** A beautiful and functional experience on any device.

  - **Admin Panel:**

      - **🔐 Secure Login:** Separate login for administrators.
      - **➕ Add Products:** Easily add new furniture to the store with images and details.
      - **📋 Product List:** View and manage all products, including stock status.
      - **🗑️ Delete Products:** Remove products from the store.
      - **📝 View Orders:** See all customer orders and their details.

  - **Server-Side (Built with Node.js & Express):**

      - **🔐 Authentication & Authorization:** JWT-based authentication for users and admins.
      - **📦 API Endpoints:** A comprehensive set of APIs for managing products, users, carts, and orders.
      - **☁️ Cloud Image Uploads:** Product images are uploaded to and served from Cloudinary.
      - **💳 Stripe Integration:** Securely process online payments with Stripe webhooks for verification.
      - **🍃 MongoDB Database:** A flexible and scalable NoSQL database for all application data.

## 🛠️ Tech Stack

  - **Frontend:** React, Vite, Tailwind CSS, Axios
  - **Backend:** Node.js, Express.js
  - **Database:** MongoDB
  - **Authentication:** JWT, bcryptjs
  - **Image Storage:** Cloudinary
  - **Payment Gateway:** Stripe

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  - Node.js and npm (or yarn)
  - MongoDB account and connection URI
  - Cloudinary account credentials
  - Stripe account credentials

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

    # Admin Credentials
    SELLER_EMAIL=admin_email@example.com
    SELLER_PASSWORD=admin_password

    # MongoDB Setup
    MONGODB_URI=mongodb_connection_string

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
    CLOUDINARY_API_KEY=cloudinary_api_key
    CLOUDINARY_API_SECRET=cloudinary_api_secret

    # Stripe Setup
    STRIPE_SECRET_KEY=stripe_secret_key
    STRIPE_WEBHOOK_SECRET=stripe_webhook_secret

    # JWT Secret
    JWT_SECRET=a_super_secret_key
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

-----
