<template>
    <div class="payment-summary">
        <p class="small">
            <span class="green-text boldFont small">Make Payment </span> > Order
            Confirmed
        </p>

        <div class="form-container">
            <form @submit.prevent="submitCheckout">
                <div class="form-group email-input">
                    <label for="email" class="small">Email*</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter you email address"
                        aria-label="Email"
                        v-model="form.email"
                    />
                </div>
                <div class="form-group card-input">
                    <label for="cardNumber" class="small">Card Number*</label>
                    <input
                        type="text"
                        id="cardNumber"
                        placeholder="1234 5678 9101 1121"
                        aria-label="Card Number"
                        v-model="form.cardNumber"
                    />
                </div>
                <div class="code-input">
                    <div class="form-group col-lg-2 col-12">
                        <label for="expiryDate" class="small"
                            >Expiry Date*</label
                        >
                        <input
                            type="text"
                            id="expiryDate"
                            placeholder="MM/YY"
                            aria-label="Expiry Date"
                            v-model="form.cardExpiry"
                        />
                    </div>
                    <div class="col-lg-1">
                        <!-- Spacer -->
                    </div>
                    <div class="form-group col-lg-2 col-12">
                        <label for="securityNumber" class="small"
                            >CVC/CVV*</label
                        >
                        <input
                            type="text"
                            id="securityNumber"
                            placeholder="123"
                            aria-label="Security Number"
                            v-model="form.cardCvc"
                        />
                    </div>
                    <div class="col-lg-1">
                        <!-- Spacer -->
                    </div>
                    <div class="form-group col-lg-6 col-12">
                        <label for="postCode" class="small"
                            >Zip Code / Postal Code*</label
                        >
                        <input
                            type="text"
                            id="postCode"
                            placeholder="PO12 1AB"
                            aria-label="Post Code"
                            v-model="form.postalCode"
                        />
                    </div>
                </div>
                <div class="form-group name-on-card">
                    <label for="nameOnCard" class="small">Name on card*</label>
                    <input
                        type="text"
                        id="nameOnCard"
                        placeholder="Enter your name as shown"
                        aria-label="Name on Card"
                        v-model="form.nameOnCard"
                    />
                </div>
                <div class="col-12">
                    <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="payment-button"
                    >
                        Pay by Card
                    </button>
                </div>
                <div v-if="errorMessages.length > 0">
                    <p
                        v-for="(msg, index) in errorMessages"
                        :key="index"
                        class="small"
                    >
                        {{ msg }}
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { CheckoutData } from "../type/CheckoutType";
import { checkout } from "../services/apiHandler";
import Joi from "joi";

const router = useRouter();

const form = ref<CheckoutData>({
    email: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    postalCode: "",
    nameOnCard: "",
});
const cardExpiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const cardCvcRegex = /^\d{3,4}$/;

const errorMessages = ref<string[]>([]);
const isSubmitting = ref(false);

const schema = Joi.object({
    email: Joi.string()
        .email({ tlds: false })
        .required()
        .label("Email")
        .messages({ "string.email": "Please enter a valid email address." }),
    cardNumber: Joi.string()
        .creditCard()
        .required()
        .label("Card Number")
        .messages({ "string.creditCard": "Please enter a valid card number" }),
    cardExpiry: Joi.string()
        .pattern(cardExpiryRegex, "MM/YY")
        .required()
        .label("Expiry Date")
        .messages({
            "string.pattern.base": "Expiry date must be in MM/YY format",
        }),
    cardCvc: Joi.string()
        .pattern(cardCvcRegex, "3 or 4 digits")
        .required()
        .label("CVC/CVV")
        .messages({ "string.pattern.base": "CVC/CVV must be 3 or 4 digits." }),
    postalCode: Joi.string().required().label("Postal Code"),
    nameOnCard: Joi.string().required().label("Name on Card"),
});

const validate = (): boolean => {
    const result = schema.validate(form.value, { abortEarly: false });
    if (result.error) {
        errorMessages.value = result.error.details.map(
            (detail) => detail.message
        );
        return false;
    }
    errorMessages.value = [];
    return true;
};

const submitCheckout = async () => {
    if (!validate()) return;
    isSubmitting.value = true;
    try {
        const response = await checkout("1", form.value);
        if (response.success) {
            router.push({
                name: "Confirmation",
                params: { orderId: response.transactionId },
            });
        }
    } catch (error) {
        console.error("Checkout failed", error);
    } finally {
        isSubmitting.value = false;
    }
};
</script>
