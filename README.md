# Transactional Order & Inventory Management System

A backend-focused system that implements **transactional inventory management** using Node.js and MongoDB.

The project intentionally avoids frontend complexity and payment integrations to focus on **correctness, data integrity, and safe handling of concurrent requests**.

---

## 🎯 Project Objective

Prevent **overselling of inventory** when multiple users attempt to reserve or purchase the same product concurrently.

The system guarantees:
- Inventory never goes negative
- No partial or inconsistent updates
- Safe recovery from crashes and abandoned checkouts

---

## 🧠 Core Design Overview

Inventory is **reserved before order confirmation**.

1. A user creates an inventory reservation
2. Inventory is **atomically locked** using a database transaction
3. The reservation is either:
   - Confirmed as an order
   - Or automatically expired, releasing inventory

This approach mirrors real-world inventory management systems.

---

## 🏗️ System Architecture

Client (Postman / API Client)
↓
Express Controllers
↓
Service Layer
↓
MongoDB Transactions (Replica Set)

yaml
Copy code

All inventory mutations occur inside MongoDB transactions.

---

## 🏗️ Architecture Diagram

+--------------------+
| API Client |
| (Postman / Curl) |
+---------+----------+
|
v
+--------------------+
| Express Server |
| (Controllers) |
+---------+----------+
|
v
+--------------------+
| Service Layer |
| - Reservation |
| - Order |
| - Expiry Job |
+---------+----------+
|
v
+-------------------------------+
| MongoDB Replica Set |
| |
| +-------------------------+ |
| | Product | |
| | - totalStock | |
| | - availableStock | |
| +-------------------------+ |
| |
| +-------------------------+ |
| | InventoryReservation | |
| | - status (ACTIVE, ...) | |
| | - expiresAt | |
| +-------------------------+ |
| |
| +-------------------------+ |
| | Order | |
| | - reservationId | |
| | - priceAtPurchase | |
| +-------------------------+ |
| |
| (All writes via |
| MongoDB Transactions) |
+-------------------------------+

## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | Node.js + Express |
| Database | MongoDB (Replica Set) |
| ODM | Mongoose |
| Frontend | None |

---

## 📦 Data Models

### Product

Represents physical inventory.

Key fields:
- `totalStock` – total physical stock
- `availableStock` – currently reservable stock

Invariant:
0 ≤ availableStock ≤ totalStock

yaml
Copy code

---

### InventoryReservation

Represents a temporary lock on inventory.

Possible states:
- `ACTIVE`
- `CONFIRMED`
- `EXPIRED`
- `CANCELLED`

Each reservation has an expiration timestamp to prevent indefinite locks.

---

### Order

Represents a completed purchase.

Characteristics:
- Created only from a reservation
- Does not modify inventory
- Uses the reservation ID to ensure idempotency

---

## 🔐 Concurrency Control

Inventory updates are performed **inside MongoDB transactions**.

Under concurrent requests:
- Multiple operations may read the same stock
- Only one transaction can commit successfully
- Conflicting transactions are aborted automatically

This prevents overselling without manual locking.

---

## 🔄 Reservation Lifecycle

Product
↓
Reservation (ACTIVE)
↓
Order (CONFIRMED)

sql
Copy code

If a reservation is not confirmed within the allowed time window:

ACTIVE → EXPIRED → inventory released

yaml
Copy code

---

## ⏱️ Reservation Expiry Job

A background job runs periodically to:
- Identify expired reservations
- Atomically:
  - Restore inventory
  - Mark reservations as expired

The job is:
- Idempotent
- Crash-safe
- Safe to run repeatedly

---

## 🧪 Concurrency Testing

The system was tested by:
- Creating products with limited stock
- Issuing multiple concurrent reservation requests
- Verifying that:
  - Only allowed reservations succeed
  - Remaining requests fail gracefully
  - Inventory values remain consistent

---

## 🚫 Out of Scope

The following were intentionally excluded:
- Payment processing
- Frontend UI
- Advanced role-based authorization
- Heavy DevOps pipelines

The focus is on correctness and robustness of backend logic.

---

## 🔧 Possible Improvements

- Redis-based caching for read-heavy endpoints
- Dedicated worker service for background jobs
- Message queues for order-related events
- Horizontal scaling strategies

---

## 🏁 Conclusion

This project demonstrates a clean and reliable approach to transactional inventory management, with strong guarantees around data integrity, concurrency safety, and failure handling.