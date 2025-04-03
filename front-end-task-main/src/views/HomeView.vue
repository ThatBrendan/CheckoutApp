<template>
    <div class="container">
        <div class="checkout row no-gutter">
            <div class="col-lg-6 basket-container">
                <BasketSummary v-if="basket" :basket="basket" />
                <p v-else>Loading basket...</p>
            </div>
            <div class="col-lg-6 checkout-container">
                <CheckoutForm />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import BasketSummary from "../components/BasketSummary.vue";
import CheckoutForm from "../components/CheckoutForm.vue";
import { getBasket } from "../services/apiHandler";
import type { Basket } from "../type/CheckoutType";

const basket = ref<Basket | null>(null);
const notification = ref({ message: "", type: "" });

const loadBasket = async () => {
    try {
        basket.value = await getBasket();
    } catch (error) {
        notification.value = {
            message: "Error loading basket",
            type: "error",
        };
    }
};

onMounted(loadBasket);
</script>
