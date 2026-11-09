export function calculateInvoice(lines, customerRate = 0, taxRate = 0) {
  // SLS 1: Validate collection and normalize numeric rates
  if (!Array.isArray(lines)) return { subtotal: 0, discount: 0, tax: 0, total: 0, skipped: 0 };
  const safeCustomerRate = Number.isFinite(customerRate) ? Math.min(1, Math.max(0, customerRate)) : 0;
  const safeTaxRate = Number.isFinite(taxRate) ? Math.max(0, taxRate) : 0;
  let subtotal = 0;
  const discountedLines = [];
  let skipped = 0;

  // SLS 2: Process each invoice line independently
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line || typeof line.price !== 'number' || !Number.isFinite(line.price) || line.price < 0) {
      skipped++;
      continue;
    }
    const quantity = typeof line.quantity === 'number' && line.quantity > 0 ? line.quantity : 1;
    const lineSubtotal = line.price * quantity;
    subtotal += lineSubtotal;

    // SLS 3: Apply an optional line-level percentage discount
    let lineRate = typeof line.discountRate === 'number' && Number.isFinite(line.discountRate)
      ? Math.min(1, Math.max(0, line.discountRate))
      : 0;
    if (line.category === 'CLEARANCE') lineRate = Math.max(lineRate, 0.25);
    discountedLines.push(lineSubtotal * (1 - lineRate));
  }

  // SLS 4: Accumulate discounted lines before applying customer-level rules
  let discounted = 0;
  let lineIndex = 0;
  while (lineIndex < discountedLines.length) {
    discounted += discountedLines[lineIndex];
    lineIndex++;
  }

  // SLS 5: Apply the customer discount and calculate tax on discounted subtotal
  const customerDiscount = discounted * safeCustomerRate;
  const taxable = Math.max(0, discounted - customerDiscount);
  const tax = taxable * safeTaxRate;

  // SLS 6: Round monetary output once at the presentation boundary
  const cents = value => Math.round((value + Number.EPSILON) * 100) / 100;
  return {
    subtotal: cents(subtotal),
    discount: cents(subtotal - taxable),
    tax: cents(tax),
    total: cents(taxable + tax),
    skipped
  };
}
