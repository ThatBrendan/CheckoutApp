import { test, expect } from "@playwright/test";

test("Checkout process redirects to confirmation page", async ({ page }) => {
    await page.goto("http://localhost:8080/");

    await expect(page.locator(".basket-summary")).toBeVisible();

    // Apply coupon code
    await page.fill('input[aria-label="Coupon Code"]', "25OFF");
    await page.click("button.apply-button");

    // Verify that the coupon success message appears
    await expect(page.locator(".coupon-message")).toHaveText(
        "Coupon applied successfully!"
    );

    // Apply another coupon code whilst there is an existing coupon
    await page.fill('input[aria-label="Coupon Code"]', "25OFF");
    await page.click("button.apply-button");

    // Verify that the coupon message appears
    await expect(page.locator(".coupon-message")).toHaveText(
        "A coupon has already been applied."
    );

    // Verify that the updated basket subtotal is shown
    await expect(page.locator('p:has-text("Subtotal:")')).toContainText(
        "11.24"
    );

    await page.fill("input#email", "john.doe@example.com");
    await page.fill("input#cardNumber", "1111222233334444");
    await page.fill("input#expiryDate", "01/24");
    await page.fill("input#securityNumber", "123");
    await page.fill("input#postCode", "SW1W 0NY");
    await page.fill("input#nameOnCard", "John Doe");

    // Click the payment button and wait for navigation
    await Promise.all([
        page.waitForNavigation({ timeout: 15000 }),
        page.click('button[type="submit"]'),
    ]);

    await expect(page.locator("h2")).toHaveText("Order Complete");
});
