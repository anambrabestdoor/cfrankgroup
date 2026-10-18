# Firestore Security Specification

## Data Invariants
1. `products`: Anyone can read active products. Only authenticated admin users can create, update, or delete products.
2. `orders`: Anyone can create an order (checkout flow). Users can read their own orders based on email/owner matching or authenticated admin access.
3. `users`: Users can read and update their own profile document (`/users/{userId}`). Admins can read all profiles.
4. `newsletters`: Users can submit subscription records.

## Dirty Dozen Payloads & Test Runner
The security spec outlines verification of strict keys, type checking, max string length constraints, and owner authorization.
