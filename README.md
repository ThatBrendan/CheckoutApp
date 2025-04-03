<<<<<<< HEAD
# CheckoutApp
A simple front-end checkout application that mimics a real-life e-commerce checkout process. The project is built using Vue 3 and Typescript. It integrates with a set of RESTful APIs for fetching the basket, appyling coupons and processing checkout payments.

## Overview
This project provides a responsive checkout experience wheree users can
- View their order summary and basket details.
- Apply a coupon to get a discount on their order.
- Fill in payment details and compelete the checkout process.
- Receive confirmation of their successful transaction.

  
### Setup

```shell
npm install
```

Launch the APIs this will run on port 3000

```shell
npm run api
```

This project uses vite to run the dev server execute

```shell
npm run dev
```

To run the Playwright tests, execute

```shell
npm playwright test
```

To view the Playwright tests report, execute

```shell
npm playwright show-report
```

### API endpoints

There are 3 endpoints

The first to `GET` the basket with the selected products and price information. The second is a `POST` endpoint to submit the checkout, more information can be found below. Lastly there is a `POST` coupon endpoint that will apply a discount to the basket and return the updated basket.

Be sure to pass the `Content-Type` header of `application/json` when performing the post requests.

#### Get basket endpoint

```text
GET  /api/basket
```

This will return

```json
{
  "id": "1",
  "products": [
    {
      "name": "Medium Booster",
      "price": 9.99,
      "image": "medium_booster.png",
      "quantity": 1
    },
    {
      "name": "Small Coins",
      "price": 4.99,
      "image": "small_coins.png",
      "quantity": 1
    }
  ],
  "couponCode": null,
  "subTotal": 14.98,
  "salesTax": 3.00,
  "total": 17.98,
}
```

#### Apply coupon endpoint

```text
POST  /api/basket/:id/coupon
Body: 
{
    "code": "25OFF"
}
```

This will return the basket along with the applied discount, use code 25OFF for 25% off the total price.

```json
{
  "id": "1",
  "products": [
    {
      "name": "Medium Booster",
      "price": 9.99,
      "image": "medium_booster.png",
      "quantity": 1
    },
    {
      "name": "Small Coins",
      "price": 4.99,
      "image": "small_coins.png",
      "quantity": 1
    }
  ],
  "couponCode": "25OFF",
  "subTotal": 11.24,
  "salesTax": 2.25,
  "total": 13.48
}
```

#### Complete checkout endpoint

```text
POST  /api/basket/:id/checkout
Body:
{
    cardCvc: "123",
    cardExpiry: "01/24",
    cardNumber: "1111222233334444",
    email: "john.doe@example.com",
    nameOnCard: "John Doe",
    postalCode: "SW1W 0NY"
}
```

This will return

```json
{ "success": true, "transactionId": "tbx-6a6da59ebfa86d3d106fb68be75c0fd7" }
```
