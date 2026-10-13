# Auction Bidding API

## Assignment ID START OF ReadME.md

`v#hdf38%44`

## Overview

A REST API for placing bids on auctions using Node.js, Express.js, and MongoDB. The API ensures that only strictly higher bids are accepted and maintains the current highest bid for each auction.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript

## Features

- Place a bid using `POST /bid`.
- Validate auction ID, user ID, and bid amount.
- Accept only bids higher than the current highest bid.
- Track the current highest bidder on each auction.
- Reject bids on closed or not-yet-started auctions.
- Use MongoDB transactions to keep auction state and bid history consistent.
- Handle concurrent bid attempts using conditional database updates.
- Reject a user's attempt to bid again while they are the current highest bidder.

## Project Structure

```text
auction_bidding_assesment_devendra_07_04/
├── index.js
├── package.json
├── .env
└── src/
    ├── controller/
    │   └── bid.js
    ├── models/
    │   ├── auction.js
    │   └── bid.js
    ├── routes/
    │   ├── index.js
    │   └── bid.js
    ├── services/
    │   └── bid.js
    └── validations/
        └── bid.js
```

## Prerequisites

- Node.js and npm
- MongoDB configured as a replica set
- MongoDB Shell (`mongosh`) for database administration

## Installation

Clone or download the project and navigate to its root directory.

```bash
npm install
```

Install the required dependencies if they are not already present:

```bash
npm install express mongoose dotenv
npm install --save-dev nodemon
```

## Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/auction_db?replicaSet=rs0
```

Update `MONGO_URI` if your MongoDB instance uses a different connection string.

## MongoDB Setup

The application uses MongoDB transactions. Transactions require a replica set or sharded cluster.

For a local development database, configure a single-node replica set named `rs0` and initialize it if it has not already been initialized.

Check the replica-set status in `mongosh`:

```javascript
rs.status()
```

Ensure the node becomes `PRIMARY` before testing the API.

## Running the Application

Start the development server:

```bash
npm run dev
```

Or start it normally:

```bash
npm start
```

The API will be available at:

`http://localhost:3000`

## API Reference

### Place a Bid

**Endpoint:** `POST /bid`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "auction_id": "YOUR_AUCTION_OBJECT_ID",
  "user_id": "user_101",
  "amount": 150
}
```

Replace `YOUR_AUCTION_OBJECT_ID` with the ID of an existing auction.

#### Successful Response

HTTP `201 Created`

```json
{
  "success": true,
  "message": "Bid placed successfully",
  "data": {
    "bid": {
      "_id": "GENERATED_BID_ID",
      "auction_id": "YOUR_AUCTION_OBJECT_ID",
      "user_id": "user_101",
      "amount": 150
    },
    "currentTopBid": 150,
    "currentTopBidder": "user_101",
    "currentTopBidAt": "TIMESTAMP"
  }
}
```

The actual response includes the generated bid ID and timestamps.

## Data Model

### Auction

The auction document stores:

- Auction title
- Status (`open` or `closed`)
- Start and end timestamps
- Current highest bid
- Current highest bidder
- Timestamp of the current highest bid

Keeping the current highest bid on the auction document allows the API to check the current bidding state without scanning the entire bid history.

### Bid

Each accepted bid stores:

- Auction ID
- User ID
- Bid amount
- Creation and update timestamps

The bids collection maintains the history of accepted bids separately from the current auction state.

## Bidding Rules

1. The auction must exist and be open.
2. The auction must have started.
3. The bid must arrive before the auction's closing timestamp.
4. The bid amount must be strictly greater than the current highest bid.
5. A user who is already the highest bidder cannot place another bid.
6. The auction update and bid insertion are performed in a transaction.
7. If the auction state changes concurrently, a bid that no longer satisfies the database conditions is rejected.

## Error Handling

| HTTP Status | Meaning |
|---|---|
| `400 Bad Request` | Invalid or missing request fields |
| `404 Not Found` | Auction does not exist |
| `409 Conflict` | Bid rejected due to auction state, closing time, or bidding rules |
| `500 Internal Server Error` | Unexpected server error |







### 1. Data model
I used separate Auction and Bid models. The Auction stores the current highest bid and bidder for quick access, while Bid stores the history of accepted bids.

### 2. Auction close boundary
A bid is accepted only if the auction is open and the server time is before its closing time. At the exact closing time, the bid is rejected.

### 3. Handling new bids
I validate the request and check the current bid before updating the auction. I use an atomic conditional update and a transaction to keep the auction's top bid and bid history consistent when requests arrive concurrently.

### 4. User bidding on their own top bid
I reject the bid if the user is already the highest bidder. This avoids unnecessary bid increases by the same user.

### 5. What I would improve for production
I would add idempotency keys so retries return the original result instead of being treated as new requests. I would also add authentication and authorization rather than trusting the supplied `user_id`.


## Assignment ID END OF ReadME.md
v#hdf38%44