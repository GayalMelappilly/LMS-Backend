# 🌐 Learnify Backend
Welcome to the Learnify Backend — the server-side powerhouse of Learnify, a dynamic Learning Management System (LMS) designed for educators and learners alike! This backend service provides robust APIs, efficient caching, secure authentication, real-time updates, and much more.


## 📑 Table of Contents
- [About Learnify](#-about-learnify)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Setup & Installation](#%EF%B8%8F-setup--installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)


## 🎓 About Learnify
Learnify is a full-featured LMS that allows users to create, sell, and enroll in courses, while administrators have access to advanced management tools. This backend serves as the foundation, handling everything from user authentication and payment processing to real-time notifications and caching.


## 🛠 Tech Stack

The backend of Learnify is built using the following technologies:

- **Node.js & Express.js** — Used for building fast, scalable server-side applications.
- **MongoDB** — The primary database for managing users, courses, and transactions.
- **Redis** — Implements advanced caching, optimizing data handling and response times.
- **Socket.io** — Powers real-time updates and notifications to enhance user experience.
- **JWT** — Ensures secure token-based authentication.
- **NodeMailer** — Utilized for automated email notifications and OTP verification.
- **Stripe** — Secure payment processing for transactions.
- **Cloudinary** — Handles media uploads (images, videos) efficiently.



## 🚀 Features

### Multi-layered Authentication:
- Supports **Google OAuth** and **GitHub OAuth**.
- Traditional **email & password** login with **OTP verification**.
- **JWT Authentication** with **Refresh** and **Access Tokens** for enhanced security.

### Advanced Caching with Redis:
- Reduces latency and optimizes database usage.
- Ensures fast retrieval of frequently accessed data.

### Real-time Updates:
- Uses **Socket.io** to provide instant notifications and chat functionalities.

### Automated Email Notifications:
- Sends out **account confirmations**, **password reset links**, and important notifications through **NodeMailer**.

### Comprehensive Analytics:
- Includes endpoints to retrieve data for **Order Analytics**, **User Analytics**, and **Course Analytics**.
- Admins can track **engagement** and **sales trends**.

### Media Management:
- Integrated with **Cloudinary** for efficient **image** and **video uploads**.


## ⚙️ Setup & Installation

### 1. Clone the Repository:

Open your terminal and run the following command to clone the repository:

```bash
git clone https://github.com/GayalMelappilly/LMS-Backend.git
cd LMS-Backend
```

### 2. Install Dependencies:

Install the required dependencies by running:

```bash
npm install
```

### 3. Setup Environment Variables:

Create a .env file in the root directory of the project. Add your environment variables (see the Environment Variables section above for details).

### 4. Start the Server:

Run the following command to start the server in development mode:

```bash
npm run dev
```


## 🌍 Environment Variables

| **Variable**                  | **Description**                                               |
|-------------------------------|---------------------------------------------------------------|
| `PORT`                         | The port for the server to run on                            |
| `ORIGIN`                       | Allowed origins for CORS                                     |
| `NODE_ENV`                     | The environment mode (development/production)                |
| `DB_URL`                       | MongoDB database connection URL                              |
| `CLOUD_NAME`                   | Cloudinary cloud name                                        |
| `CLOUD_API_KEY`                | Cloudinary API key                                           |
| `CLOUD_SECRET_KEY`             | Cloudinary API secret key                                    |
| `REDIS_URL`                    | Redis URL for caching                                        |
| `ACTIVATION_SECRET`            | Secret key for email activation process                      |
| `ACCESS_TOKEN`                 | Secret for JWT access token                                  |
| `REFRESH_TOKEN`                | Secret for JWT refresh token                                 |
| `ACCESS_TOKEN_EXPIRE`          | Expiration time for access token (in hours)                  |
| `REFRESH_TOKEN_EXPIRE`         | Expiration time for refresh token (in hours)                 |
| `SMTP_HOST`                    | SMTP server host for email services                          |
| `SMTP_PORT`                    | SMTP server port                                             |
| `SMTP_SERVICE`                 | SMTP service provider (e.g., Gmail, Yahoo)                   |
| `SMTP_MAIL`                    | Email address for sending emails                             |
| `SMTP_PASSWORD`                | SMTP service email password                                  |
| `VDOCIPHER_API_SECRET`         | API secret key for Vdocipher video upload                    |
| `STRIPE_SECRET_KEY`            | Stripe secret key for payment processing                     |
| `STRIPE_PUBLISHABLE_KEY`       | Stripe publishable key for frontend integration              |



## 📚 API Endpoints

### Analytics
- **GET** `/analytics/get-users-analytics` - Retrieve users' analytics (Admin only).
- **GET** `/analytics/get-courses-analytics` - Retrieve courses' analytics (Admin only).
- **GET** `/analytics/get-orders-analytics` - Retrieve orders' analytics (Admin only).

### Courses
- **POST** `/courses/create-course` - Create a new course (Admin only).
- **PUT** `/courses/edit-course/:id` - Edit a course (Admin only).
- **GET** `/courses/get-course/:id` - Retrieve a single course.
- **GET** `/courses/get-courses/:id` - Retrieve all courses by ID.
- **GET** `/courses/get-admin-courses` - Retrieve all courses for admin (Admin only).
- **GET** `/courses/get-course-content/:id` - Retrieve course content for a user.
- **PUT** `/courses/add-question` - Add a question to a course.
- **PUT** `/courses/add-answer` - Add an answer to a question.
- **PUT** `/courses/add-review/:id` - Add a review to a course.
- **PUT** `/courses/add-reply` - Add a reply to a review (Admin only).
- **GET** `/courses/get-courses` - Retrieve all courses (Admin only).
- **POST** `/courses/getVdoCipherOTP` - Generate a video URL for course content.
- **DELETE** `/courses/delete-course/:id` - Delete a course (Admin only).

### Layout
- **POST** `/layout/create-layout` - Create a new layout (Admin only).
- **PUT** `/layout/edit-layout` - Edit an existing layout (Admin only).
- **GET** `/layout/get-layout/:type` - Retrieve a layout by type.

### Notifications
- **GET** `/notifications/get-all-notifications` - Retrieve all notifications (Admin only).
- **PUT** `/notifications/update-notification/:id` - Update a notification (Admin only).

### Orders
- **POST** `/orders/create-order` - Create a new order.
- **GET** `/orders/get-orders` - Retrieve all orders (Admin only).
- **GET** `/orders/payment/stripepublishablekey` - Get Stripe publishable key.
- **POST** `/orders/payment` - Make a payment.

### Users
- **POST** `/users/registration` - Register a new user.
- **POST** `/users/activate-user` - Activate a user account.
- **POST** `/users/login` - User login.
- **GET** `/users/logout` - User logout.
- **GET** `/users/refresh` - Refresh JWT access token.
- **GET** `/users/me` - Get user info.
- **POST** `/users/social-auth` - Social authentication (e.g., Google, GitHub).
- **PUT** `/users/update-user-info` - Update user information.
- **PUT** `/users/update-password` - Update user password.
- **PUT** `/users/update-user-avatar` - Update user avatar.
- **GET** `/users/get-users` - Retrieve all users (Admin only).
- **PUT** `/users/update-user` - Update user role (Admin only).
- **DELETE** `/users/delete-user/:id` - Delete a user (Admin only).



## 📂 Folder Structure

```plaintext
learnify-backend/
├── @types/                   # TypeScript custom types
├── build/                    # Compiled output (usually generated after build)
├── controllers/              # Handles requests and core business logic
│   ├── analytics.controller.ts
│   ├── course.controller.ts
│   ├── layout.controller.ts
│   ├── notification.controller.ts
│   ├── order.controller.ts
│   └── user.controller.ts
├── mails/                    # Email templates
│   ├── activation-mail.ejs
│   ├── order-confirmation.ejs
│   └── question-reply-mail.ejs
├── middleware/               # Middleware for security, error handling, etc.
│   ├── auth.ts
│   ├── catchAsyncError.ts
│   └── error.ts
├── models/                   # Database schemas using Mongoose
│   ├── course.model.ts
│   ├── layout.model.ts
│   ├── notification.model.ts
│   ├── order.model.ts
│   └── user.model.ts
├── routes/                   # API route definitions for different endpoints
│   ├── analytics.route.ts
│   ├── course.route.ts
│   ├── layout.route.ts
│   ├── notification.route.ts
│   ├── order.route.ts
│   └── user.route.ts
├── services/                 # Business logic and service layer
│   ├── course.service.ts
│   ├── order.service.ts
│   └── user.service.ts
├── utils/                    # Utility functions and helpers
│   ├── ErrorHandler.ts
│   ├── analytics.generator.ts
│   ├── db.ts
│   ├── jwt.ts
│   ├── redis.ts
│   └── sendMail.ts
├── .gitignore                # Git ignore file
├── Procfile                  # Process file for deployment (Heroku, etc.)
├── README.md                 # Project documentation
├── app.ts                    # Application configuration
├── package-lock.json         # Package lock file
├── package.json              # Package dependencies and scripts
├── server.ts                 # Main server entry point
├── socketServer.ts           # Socket server for real-time updates
└── tsconfig.json             # TypeScript configuration
```


## 🌱 Future Improvements
- **Enhanced Security**: Implement multi-factor authentication.
- **Performance Optimization**: Further optimize database queries.
- **Role-Based Access**: Introduce fine-grained access control for different user roles.
- **In-app Messaging**: Add a real-time messaging feature for users.


## 🤝 Contributing
We welcome contributions! Here’s how you can help:

### 1. Fork the repository.
### 2. Create a new branch:
```bash
git checkout -b feature/YourFeature
```
### 3. Commit your changes:
```bash
git commit -m 'Add feature'
```
### 4. Push to the branch:
```bash
git push origin feature/YourFeature
```
### 5. Open a Pull Request.


---

#### Thank you for exploring the Learnify Backend repository! Feel free to star this repo if you find it helpful ⭐ and reach out with questions or suggestions. Happy coding! 🚀

