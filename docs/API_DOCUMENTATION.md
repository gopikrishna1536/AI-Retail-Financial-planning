# Server 1 API Documentation

## Overview & Base URL

- **Base URL**: `http://localhost:5000` (Local) / `http://<ec2-server1-ip>:5000` (AWS)
- **Authentication**: JWT Bearer token passed in HTTP header: `Authorization: Bearer <token>`
- **Response Format**: Standardized JSON:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## 1. System & Health Endpoints

### `GET /health`
- **Auth**: Public
- **Description**: Returns application and database connectivity status.
- **Response (200 OK)**:
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2026-08-30T17:58:31.000Z",
  "database": {
    "connected": true,
    "client": "pg",
    "error": null
  }
}
```

### `GET /api/system/ml-status`
- **Auth**: Bearer Token required
- **Description**: Checks connectivity from Server 1 to Server 2 AI/ML microservice.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "reachable": true,
    "url": "http://localhost:8000",
    "response": { "status": "ok", "service": "AI/ML Forecasting Engine" }
  }
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "organization_name": "RetailCorp India",
  "email": "admin@retailcorp.com",
  "password": "AdminPassword123!",
  "first_name": "System",
  "last_name": "Admin",
  "role": "ADMIN"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "855f768e-b59f-4831-b054-34003393b88c",
      "organization_id": "855f768e-b59f-4831-b054-34003393b88c",
      "email": "admin@retailcorp.com",
      "first_name": "System",
      "last_name": "Admin",
      "role": "ADMIN"
    }
  }
}
```

### `POST /api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "admin@retailcorp.com",
  "password": "AdminPassword123!"
}
```
- **Response (200 OK)**: Returns JWT token and user profile.

### `GET /api/auth/me`
- **Auth**: Bearer Token required
- **Description**: Retrieves current authenticated user profile and tenant organization info.

---

## 3. Store Management Endpoints

### `GET /api/stores`
- **Auth**: Bearer Token required
- **Query Parameters**: `state`, `region`, `outlet_type`, `city_type`
- **Response (200 OK)**: List of stores scoped to user's `organization_id`.

### `POST /api/stores`
- **Auth**: Bearer Token (`ADMIN`, `MANAGER`)
- **Request Body**:
```json
{
  "store_code": "STR-DELH-110001-L",
  "state": "Delhi",
  "postal_code": "110001",
  "city_type": "Tier 1",
  "outlet_type": "Large",
  "region": "North"
}
```

---

## 4. Sales & Inventory Endpoints

### `GET /api/sales`
- **Auth**: Bearer Token required
- **Query Parameters**: `page` (default 1), `limit` (default 50), `store_id`, `product_id`, `category_id`, `start_date`, `end_date`, `region`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Sales transactions retrieved successfully",
  "data": [
    {
      "id": "137fd6e4-f393-49fd-812a-2078ca745a9e",
      "order_id": "ORD000001",
      "sales_date": "2023-03-11",
      "quantity": 3,
      "sales_amount": 3344.69,
      "discount": 0.09,
      "profit_amount": 448.24,
      "store_code": "STR-WEST-700001-L",
      "product_name": "Burgers - 718",
      "category_name": "Fast Food"
    }
  ],
  "pagination": {
    "total": 100000,
    "page": 1,
    "limit": 50,
    "totalPages": 2000,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 5. Financial Planning & Budget Endpoints

### `GET /api/dashboard/summary`
- **Auth**: Bearer Token required
- **Query Parameters**: `year`, `store_id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Dashboard financial summary calculated",
  "data": {
    "total_revenue": 2508441014.20,
    "total_expenses": 576941433.27,
    "net_profit": 375530511.40,
    "profit_margin": 14.97,
    "planned_revenue": 2709116295.34,
    "planned_expenses": 2384022339.90,
    "planned_profit": 325093955.44,
    "budget_utilization": 98.42,
    "revenue_variance": -200670181.14,
    "expense_variance": -1807080906.63,
    "profit_variance": 50436555.96
  }
}
```

### `GET /api/financial-plans`
- **Auth**: Bearer Token required
- **Query Parameters**: `year`, `period_type` (`ANNUAL`, `QUARTERLY`, `MONTHLY`)

### `GET /api/budgets`
- **Auth**: Bearer Token required
- **Query Parameters**: `financial_plan_id`, `expense_category`, `status`
