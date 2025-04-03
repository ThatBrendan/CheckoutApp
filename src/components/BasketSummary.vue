<template>
    <div v-if="!basket">Loading basket...</div>
    <div v-else class="basket-summary">
        <img src="/img/logo.svg" alt="company-logo" />
        <p>Your Order</p>
        <div
            class="row no-gutter"
            v-for="product in basket.products"
            :key="product.name"
        >
            <div class="col-9">
                <div class="summary-box">
                    <img
                        :src="`/img/products/${product.image}`"
                        :alt="product.name"
                        width="50"
                        height="50"
                    />
                    <div>
                        <p>
                            {{ product.name }}
                        </p>
                        <span class="small">Qty: {{ product.quantity }}</span>
                    </div>
                </div>
            </div>
            <div class="col-3 price">
                <span>${{ formatPrice(product.price) }}</span>
            </div>
        </div>
        <div class="price-breakdown">
            <CouponInput @applyCoupon="applyCoupon" />
            <p>
                Subtotal: <span>${{ formatPrice(basket.subTotal) }}</span>
            </p>
            <p>
                Sales Tax: <span>${{ formatPrice(basket.salesTax) }}</span>
            </p>
            <p v-if="basket.couponCode">
                <span class="coupon-code">{{ basket.couponCode }}</span>
                <span
                    >-${{
                        formatPrice(props.basket.subTotal - basket.subTotal)
                    }}</span
                >
            </p>
            <p>
                Total: <span>${{ formatPrice(basket.total) }}</span>
            </p>
        </div>
        <p v-if="couponMessage" class="coupon-message">{{ couponMessage }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import CouponInput from "./CouponInput.vue";
import type { Basket } from "../type/CheckoutType";
import { applyCoupon as applyCouponService } from "../services/apiHandler";

const props = defineProps<{ basket: Basket }>();
const basket = ref(props.basket);
const couponMessage = ref<string | null>(null);

watch(
    () => props.basket,
    (newBasket) => {
        basket.value = newBasket;
    }
);

const formatPrice = (price: number) => price.toFixed(2);

const applyCoupon = async (code: string) => {
    try {
        if (!basket.value) throw new Error("Basket is not loaded");
        const updatedBasket = await applyCouponService(basket.value.id, code);
        basket.value = { ...updatedBasket };
        couponMessage.value = "Coupon applied successfully!";
    } catch (err: any) {
        const errorMessage = err.message.replace(/^Error \d+: /, "");
        couponMessage.value = errorMessage || "Invalid coupon code";
    }
};
</script>
