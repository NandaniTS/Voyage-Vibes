# API Documentation

Base URL: `http://localhost:4001/api`

## Authentication APIs

### POST /auth/signup
Create a new user account
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "traveler" | "agent"
}
```

### POST /auth/login
Login to existing account
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Package APIs

### GET /packages
Get all packages (with optional filters)
- Query params: `agentId`, `search`, `minPrice`, `maxPrice`

### GET /packages/:packageId
Get package by ID

### POST /packages
Create new package (Agent only)
```json
{
  "title": "Mountain Trek",
  "description": "Amazing mountain experience",
  "price": 1200,
  "noOfDays": 10,
  "destinations": ["Nepal"],
  "isActive": true
}
```

### PUT /packages/:packageId
Update package (Agent only)

### DELETE /packages/:packageId
Delete package (Agent only)

## Booking APIs

### POST /bookings
Create new booking
```json
{
  "userId": "user_id",
  "packageId": "package_id",
  "agentId": "agent_id",
  "numberOfTravellers": 2,
  "totalPrice": 2400,
  "startDate": "2024-04-15",
  "endDate": "2024-04-25",
  "specialRequests": "Vegetarian meals"
}
```

### GET /bookings/user/:userId
Get all bookings for a user (Traveler)

### GET /bookings/agent/:agentId
Get all bookings for an agent (Agent)

### GET /bookings/:bookingId
Get booking by ID

### PATCH /bookings/:bookingId/status
Update booking status
```json
{
  "status": "pending" | "confirmed" | "completed" | "cancelled"
}
```

## Review APIs

### POST /reviews
Create new review
```json
{
  "userId": "user_id",
  "packageId": "package_id",
  "bookingId": "booking_id",
  "rating": 5,
  "comment": "Amazing experience!"
}
```

### GET /reviews/user/:userId
Get all reviews by a user (Traveler)

### GET /reviews/package/:packageId
Get all reviews for a package

### GET /reviews/agent/:agentId
Get all reviews for an agent's packages (Agent)

### PUT /reviews/:reviewId
Update review (Traveler only)
```json
{
  "userId": "user_id",
  "rating": 4,
  "comment": "Updated review"
}
```

### POST /reviews/:reviewId/response
Add response to review (Agent only)
```json
{
  "responseText": "Thank you for your feedback!"
}
```

### DELETE /reviews/:reviewId
Delete review (Traveler only)
```json
{
  "userId": "user_id"
}
```

## Wishlist APIs

### POST /wishlist
Add package to wishlist
```json
{
  "userId": "user_id",
  "packageId": "package_id"
}
```

### GET /wishlist/user/:userId
Get user's wishlist

### GET /wishlist/check/:userId/:packageId
Check if package is in wishlist

### DELETE /wishlist/:userId/:packageId
Remove package from wishlist

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## User Types
- `traveler` - Can browse packages, make bookings, write reviews, manage wishlist
- `agent` - Can create/manage packages, view bookings, respond to reviews

## Status Values

### Booking Status
- `pending` - Booking created, awaiting confirmation
- `confirmed` - Booking confirmed by agent
- `completed` - Trip completed
- `cancelled` - Booking cancelled
