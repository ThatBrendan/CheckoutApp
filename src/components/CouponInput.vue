<template>
    <div class="coupon-input">
        <p>Coupon/Gift Card</p>
        <div class="row no-gutter">
            <div class="col-8">
                <input
                    v-model="couponCode"
                    placeholder="Enter coupon code"
                    @keyup.enter="applyCoupon"
                    aria-label="Coupon Code"
                />
            </div>
            <div class="col-1"></div>
            <div class="col-3">
                <button @click="applyCoupon" class="apply-button">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const couponCode = ref("");
const emit = defineEmits(["applyCoupon"]);

const applyCoupon = () => {
    if (couponCode.value.trim()) {
        emit("applyCoupon", couponCode.value.trim());
        couponCode.value = "";
    }
};
</script>
