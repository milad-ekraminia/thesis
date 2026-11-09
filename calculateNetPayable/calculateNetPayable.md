Method 9: Tiered Tax and Discount Bracket Calculator
JavaScript
```js
export function calculateNetPayable(items, customerTier, taxConfig) {
  // SLS 1: Parameter checks
  if (!Array.isArray(items) || items.length === 0) return { gross: 0, discount: 0, tax: 0, net: 0 };
  if (!taxConfig || typeof taxConfig.standardRate !== 'number') taxConfig = { standardRate: 0.1 };

  let gross = 0;
  let discountedTotal = 0;

  // SLS 2: Item iteration & category discounts
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item.price !== 'number' || item.price <= 0) continue;
    const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    const lineTotal = item.price * qty;
    gross += lineTotal;

    let itemDiscountRate = 0;
    if (item.category === 'CLEARANCE') {
      itemDiscountRate = 0.5;
    } else if (item.category === 'PROMO' && qty >= 3) {
      itemDiscountRate = 0.2;
    }

    discountedTotal += lineTotal * (1 - itemDiscountRate);
  }

  // SLS 3: Loyalty discount overrides
  let customerDiscountRate = 0;
  switch (customerTier) {
    case 'PLATINUM':
      customerDiscountRate = 0.25;
      break;
    case 'GOLD':
      customerDiscountRate = 0.15;
      break;
    case 'SILVER':
      customerDiscountRate = 0.05;
      break;
    default:
      customerDiscountRate = 0.0;
  }

  // SLS 4: Floor bounding on customer discounts
  let postDiscount = discountedTotal * (1 - customerDiscountRate);
  if (postDiscount < 0) postDiscount = 0;
  const totalSavings = gross - postDiscount;

  // SLS 5: Dynamic tax bracket calculation
  let effectiveTaxRate = taxConfig.standardRate;
  if (postDiscount > 1000) {
    effectiveTaxRate = taxConfig.luxuryRate ?? taxConfig.standardRate * 1.5;
  } else if (postDiscount < 50) {
    effectiveTaxRate = 0; // Exempt small totals
  }

  const taxAmount = postDiscount * effectiveTaxRate;
  const net = Math.round((postDiscount + taxAmount) * 100) / 100;

  // SLS 6: Consolidated monetary summary
  return { gross: Math.round(gross * 100) / 100, discount: Math.round(totalSavings * 100) / 100, tax: Math.round(taxAmount * 100) / 100, net };
}
```

Strategic Locational Sections:

- **SLS 1 (Lines 2–4):** Null collection handling and tax configuration fallbacks.
- **SLS 2 (Lines 9–24):** Line-item evaluation with category rules (CLEARANCE, PROMO volume thresholds).
- **SLS 3 (Lines 27–40):** Customer loyalty switches with unknown-tier defaults.
- **SLS 4 (Lines 42–45):** Floor boundary guards (`postDiscount < 0`).
- **SLS 5 (Lines 47–55):** Value-dependent tax brackets (luxury vs micro-purchase exemption).
- **SLS 6 (Lines 57–58):** Rounding and financial formatting.
