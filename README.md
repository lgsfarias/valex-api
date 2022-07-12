<p align="center">
  <a href="https://github.com/lgsfarias/valex-api">
    <img src="./info/README.png" alt="readme-logo" width="80" height="80">
  </a>

  <h2 align="center">
    valex-api
  </h2>
</p>

## About The Project

API to manage benefit cards.

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Usage

```bash
$ git clone https://github.com/lgsfarias/valex-api

$ cd valex-api

$ npm install

$ npm run dev
```

API:

```
- POST /cards
    - Route to create a new card (authenticated)
    - headers: {
      "x-api-key" : "valid apikey"
    }
    - body: {
      "employeeId": number,
      "type": 'groceries' | 'restaurant' | 'transport' | 'education' | 'health'
    }
- POST /cards/activate
    - Route to activate a card
    - headers: {}
    - body: {
      "cardId": number,
      "cardCvv": string,
      "password": string(4-digit),
    }
- GET /cards/balance/:cardId
    - Route to get card balance
    - headers: {}
    - body: {}
- POST /cards/lock
    - Route to block a card
    - headers: {}
    - body: {
      "cardId": number,
      "password": string,
    }
- POST /cards/unlock
    - Route to unblock a card
    - headers: {}
    - body: {
      "cardId": number,
      "password": string,
    }
- POST /recharges
    - Route to recharge a card (authenticated)
    - headers: {
      "x-api-key" : "valid apikey"
    }
    - body: {
      "cardId": number,
      "amount": number,
    }
- POST /payments
    - Route to make payments
    - headers: {}
    - body: {
      "cardId": number,
      "password": string,
      "businessId": number,
      "amount": number,
    }
- POST /payments
    - Route to make online payments
    - headers: {}
    - body: {
      "cardNumber": string,
      "cardholderName": string,
      "expirationDate": string("MM/YY"),
      "securityCode": string,
      "businessId": number,
      "amount": number,
    }
- POST /cards/virtual
    - Route to create a new virtual card
    - headers: {}
    - body: {
      "originalCardId": number,
      "password": string,
    }
- DELETE /cards/virtual
    - Route to create a new virtual card
    - headers: {}
    - body: {
      "cardId": number,
      "password": string,
    }
```
