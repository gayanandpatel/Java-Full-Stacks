# 🛍️ Shopifyy - Modern E-Commerce Solution

Shopifyy is a full-featured, responsive e-commerce platform built with a focus on scalability and performance. It leverages a **React** frontend and a **Java Spring Boot** backend, providing a seamless shopping experience with secure data management.



| Image of e-commerce website architecture diagram |
|---|
|![Architecture Diagram](screenshots/architecture-diagram.png) |

---
## 🚀 Key Features

* **User Authentication:** Secure login and registration using Spring Security and JWT.
* **Product Management:** Dynamic product listing with categories, search, and filtering.
* **Shopping Cart:** Persistent cart functionality managed via Redux.
* **Order Processing:** Full checkout flow with mock payment integration.
* **Admin Dashboard:** Specialized views for managing inventory and viewing sales data.
* **Responsive UI:** Fully mobile-friendly design using Bootstrap.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** - UI Library
* **Redux Toolkit** - Global State Management
* **Bootstrap 5** - Styling and Layout
* **Axios** - API Communication

### Backend
* **Java Spring Boot** - Core Framework
* **Spring Security** - Authentication & Authorization
* **Hibernate/JPA** - ORM Framework
* **MySQL** - Relational Database
* **Maven** - Project Management

---

## 📸 Screenshots

| Home Page | All Products Page | Category View |
|---|---|---|
| ![Home Page](<screenshots/landing page.png>) | ![All Product Page](<screenshots/allproducts page.png>) | ![Category View](screenshots/category.png) |

| Search View | Product Details | Register Page |
|---|---|---|
| ![Search View](screenshots/searchpage.png) | ![Product Details Page](screenshots/productdetailspage.png) | ![Register Page](screenshots/registerpage.png) |

| Login Page | Cart Page | Checkout Page |
|---|---|---|
| ![Login Page](screenshots/loginpage.png) | ![Cart Page](screenshots/cartpage-1.png) | ![Checkout Page](screenshots/checkoutpage.png) |

| Account Dashboard | Add/Update Address |
|---|---|
| ![Account  Dashboard](screenshots/accountdashboard.png) | ![Add/Update Address](<screenshots/add-update-address page.png>) |

> *Admin Dashboard*

| Admin Homepage | Add Product Page | Upload Image Page |
|---|---|---|
![Admin Homepage](screenshots/admindashboard.png) | ![Add Product Page](screenshots/addproductpage.png) | ![Upload Image Page](screenshots/uploadimagepage.png) |

| Admin Product Page | Update Product Page |
|---|---|
 ![Admin Product Page](screenshots/admin_productpage.png) | ![Update Product Page](screenshots/update-productpage.png) |
---

## ⚙️ Installation & Setup
Follow these steps to get the project running on your local machine.

### Prerequisites
* **JDK 17+**
* **Node.js** (v16 or higher)
* **MySQL Server**
* **Maven**

### 1. Database Setup
1. Open MySQL Workbench or Terminal.
2. Create a new database:
   ```sql
   CREATE DATABASE shopifyy_db;
   ```
### 2. Backend Configuration
1. Navigate to src/main/resources/application.properties.

2. Update the MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/shopifyy_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
### 3. Frontend Configuration
1. Open a new terminal and navigate to the client folder.

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
     npm start
   ```

---

## 👤 Author

**Gayanand Patel**
* **GitHub:** [@gayanandpatel](https://github.com/gayanandpatel)
* **LinkedIn:** [Gayanand Patel](https://www.linkedin.com/in/gayanand-patel/)
* **Email:** gayanand.patel@gmail.com

> Feel free to reach out if you have any questions about this project or want to collaborate!

---

## ⚖️ License

This project is licensed under the **MIT License**.

Copyright (c) 2026 **Gayanand Patel**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.