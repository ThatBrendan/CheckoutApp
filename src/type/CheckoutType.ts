interface Product {
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface Basket {
    id: string;
    products: Product[];
    couponCode: string | null;
    subTotal: number;
    salesTax: number;
    total: number;
}

export interface CheckoutData {
    cardCvc: string;
    cardExpiry: string;
    cardNumber: string;
    email: string;
    nameOnCard: string;
    postalCode: string;
}
