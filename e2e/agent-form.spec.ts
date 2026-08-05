import { test, expect } from '@playwright/test';

test.describe('AI Commerce Agent Submission Form E2E Tests', () => {

  test('should fill out form steps, navigate via router tabs, and verify live JSON payload', async ({ page }) => {
    // 1. Visit the agent registration form
    await page.goto('/admin/agents/new/identity');

    // Verify title & initial route
    await expect(page).toHaveTitle(/Register Agent - Identity|Agentic Commerce/);
    await expect(page.locator('.header-title')).toContainText('AI Commerce Agent Registration');

    // 2. Fill out Step 1: Core Identity
    const nameInput = page.locator('#agent-name');
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.fill('UCPhub.ai');

    const taglineInput = page.locator('#agent-tagline');
    await taglineInput.fill('Universal Commerce Protocol Clearinghouse');

    const descInput = page.locator('#agent-desc');
    await descInput.fill('Autonomous promotion clearinghouse and protocol primitive layer for AI agents.');

    const websiteInput = page.locator('#agent-website');
    await websiteInput.fill('https://ucphub.ai');

    // 3. Navigate to Step 2: Taxonomy via Router Tab Link
    await page.click('a.tab-button:has-text("Taxonomy")');
    await expect(page).toHaveURL(/\/admin\/agents\/new\/taxonomy/);
    await expect(page.locator('.fieldset-legend')).toContainText('Multi-Layer Taxonomy & Classification');

    // Fill Step 2 inputs
    await page.click('label.radio-card:has-text("Plumbing Stack")');
    await page.locator('#agent-category').fill('Promotional Clearing');
    await page.selectOption('#parent-ecosystem', 'Google_UCP');
    await page.selectOption('#functional-class', 'Discount_Optimization');

    // 4. Navigate to Step 3: Tech Specs via Next Button
    await page.click('a.btn-secondary:has-text("Next: Tech Specs")');
    await expect(page).toHaveURL(/\/admin\/agents\/new\/specs/);

    // 5. Navigate directly to Step 7: JSON Payload Preview
    await page.click('a.tab-button:has-text("JSON Payload")');
    await expect(page).toHaveURL(/\/admin\/agents\/new\/preview/);

    // 6. Verify that entered data is preserved and rendered in the live JSON payload!
    const jsonCodeText = await page.locator('.json-code code').textContent();
    expect(jsonCodeText).toContain('"name": "UCPhub.ai"');
    expect(jsonCodeText).toContain('"tagline": "Universal Commerce Protocol Clearinghouse"');
    expect(jsonCodeText).toContain('"websiteUrl": "https://ucphub.ai"');
    expect(jsonCodeText).toContain('"marketSide": "plumbing_stack"');
    expect(jsonCodeText).toContain('"category": "Promotional Clearing"');
    expect(jsonCodeText).toContain('"parentEcosystem": "Google_UCP"');
    expect(jsonCodeText).toContain('"functionalClass": "Discount_Optimization"');
  });

});
