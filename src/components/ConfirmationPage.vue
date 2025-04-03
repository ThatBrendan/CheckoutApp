<template>
    <div class="success-container row no-gutter">
        <div class="col-lg-6 col-12 success-container-box">
            <div class="company-logo">
                <router-link :to="{ name: 'home' }">
                    <img src="/img/logo.svg" alt="company-logo" />
                </router-link>
            </div>
            <div class="success-details">
                <div class="check-mark-logo">
                    <span class="check-mark">&#10003;</span>
                </div>
                <h2>Order Complete</h2>

                <span
                    >Thank you for your payment. You will receive your purchased
                    products shortly.</span
                >
                <p v-if="orderId" class="order-number">
                    Order number: {{ orderId }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
const orderId = route.params.orderId;
</script>
