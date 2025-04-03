import type { Basket, CheckoutData } from "../type/CheckoutType";

const API_ENDPOINTS = {
    BASKET: "/api/basket",
    COUPON: (id: string) => `/api/basket/${id}/coupon`,
    CHECKOUT: (id: string) => `/api/basket/${id}/checkout`,
};

const apiCall = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<any> => {
    const { method = "GET" } = options;
    const headers = {
        ...(method !== "GET" && { "Content-Type": "application/json" }),
        ...options.headers,
    };
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({
            message: "An unknown error occurred",
        }));
        throw new Error(`Error ${response.status}: ${errorDetails.message}`);
    }

    if (response.headers.get("Content-Type")?.includes("application/json")) {
        return response.json();
    }
    return response.text() as unknown as T;
};

export const getBasket = async (): Promise<Basket> => {
    return apiCall(API_ENDPOINTS.BASKET);
};

export const applyCoupon = async (
    basketId: string,
    code: string
): Promise<Basket> => {
    return apiCall<Basket>(API_ENDPOINTS.COUPON(basketId), {
        method: "POST",
        body: JSON.stringify({ code }),
    });
};

export const checkout = async (
    basketId: string,
    checkoutData: CheckoutData
): Promise<any> => {
    return apiCall(API_ENDPOINTS.CHECKOUT(basketId), {
        method: "POST",
        body: JSON.stringify(checkoutData),
    });
};
