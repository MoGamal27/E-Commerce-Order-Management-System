# E-Commerce Order Management System – Backend

## Project Overview

This backend system powers a robust E-Commerce Order Management platform. It provides RESTful APIs for user management, product inventory, order processing, payments, and analytics. Built with Node.js, TypeScript, Express, and Prisma ORM, it emphasizes security, scalability, and maintainability.

## Api Documentation
[Api Documentation](https://documenter.getpostman.com/view/37843029/2sB2cd5yZS#774b12d5-d5e8-447e-a2a5-9ad21c39633d)

**Key Features:**
- User registration, authentication (JWT), and role-based access
- Product CRUD, filtering, pagination, and caching
- Order creation, status management, history, and export (CSV)
- Cart management and stock validation
- Stripe payment integration
- Email notifications (order confirmation, status updates)
- Admin dashboard analytics (revenue, top products, recent orders)
- Rate limiting, input validation, and global error handling
- Real-time notifications for order updates using Socketio

---

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET_KEY=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword
SUCCESS_URL=http://localhost:3000
CANCEL_URL=http://localhost:3000
```


#### Docker Deployment

You can deploy the backend using Docker for a consistent and portable environment.

1. **Build and Start the Containers**

   ```bash
   docker-compose up --build
   ```



### Design Decisions
1. TypeScript: Ensures type safety and maintainability.
2. Prisma ORM: Simplifies database access and migrations.
3. Modular Structure: Controllers, routes, middleware, and services are separated for clarity and scalability.
4. JWT Authentication: Secure, stateless user sessions.
5. Role-based Access: Protects admin routes and sensitive operations.
6. Caching: Frequently accessed data (e.g., product list) is cached using node cache for performance.
7. Rate Limiting: Implemented via middleware to prevent abuse.
8. Email Notifications: Nodemailer is used for transactional emails.
9. Stripe Integration: Secure payment processing.
10. Docker: Containerization for consistent deployment.
11. Socket.io: Real-time notifications for order updates.
