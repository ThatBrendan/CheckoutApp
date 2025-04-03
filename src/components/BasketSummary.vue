<template>
    <div v-if="!basket">Loading basket...</div>
    <div v-else class="basket-summary">
        <p class="small">Your order</p>
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
                        <p class="medium">
                            {{ product.name }}
                        </p>
                        <span class="small">Qty: {{ product.quantity }}</span>
                    </div>
                </div>
            </div>
            <div class="col-3 price">
                <span class="small">${{ formatPrice(product.price) }}</span>
            </div>
        </div>
        <div class="price-breakdown">
            <CouponInput @applyCoupon="applyCoupon" />
            <p class="small">
                Subtotal: <span>${{ formatPrice(basket.subTotal) }}</span>
            </p>
            <p class="small">
                Sales Tax: <span>${{ formatPrice(basket.salesTax) }}</span>
            </p>
            <div v-if="basket.couponCode">
                <span class="small">Discounts: </span>
                <div class="discount-code">
                    <span class="coupon-code small">{{
                        basket.couponCode
                    }}</span>
                    <span
                        >-${{
                            formatPrice(
                                props.basket.subTotal +
                                    props.basket.salesTax -
                                    basket.total
                            )
                        }}</span
                    >
                </div>
            </div>
            <p class="large boldFont">
                Total price: <span>${{ formatPrice(basket.total) }}</span>
            </p>
        </div>
        <p v-if="couponMessage" class="coupon-message small">
            {{ couponMessage }}
        </p>
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
    // Check if a coupon has already been applied
    if (basket.value.couponCode) {
        couponMessage.value = "A coupon has already been applied.";
        return;
    }
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

<style scoped>
.discount-code {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
