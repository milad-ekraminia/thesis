export function estimateShipping(packages, services, destination) {
  // SLS 1: Validate collections and destination data
  if (!Array.isArray(packages) || !Array.isArray(services) || !destination) {
    return { quotes: [], rejectedPackages: packages?.length || 0 };
  }
  const validPackages = [];
  let rejectedPackages = 0;

  // SLS 2: Keep only packages with valid positive mass and dimensions
  for (let index = 0; index < packages.length; index++) {
    const item = packages[index];
    if (!item || !Number.isFinite(item.weight) || item.weight <= 0 ||
        !Number.isFinite(item.length) || !Number.isFinite(item.width) ||
        !Number.isFinite(item.height) || item.length <= 0 || item.width <= 0 || item.height <= 0) {
      rejectedPackages++;
      continue;
    }
    validPackages.push(item);
  }

  // SLS 3: Evaluate each service against the full package set
  const quotes = [];
  for (let serviceIndex = 0; serviceIndex < services.length; serviceIndex++) {
    const service = services[serviceIndex];
    if (!service || typeof service.name !== 'string' || !Number.isFinite(service.baseRate)) continue;
    if (Array.isArray(service.countries) && !service.countries.includes(destination.country)) continue;
    let totalWeight = 0;
    let volumetricWeight = 0;

    // SLS 4: Sum shipment weight and volumetric weight
    let packageIndex = 0;
    while (packageIndex < validPackages.length) {
      const item = validPackages[packageIndex++];
      totalWeight += item.weight;
      volumetricWeight += (item.length * item.width * item.height) / (service.divisor || 5000);
    }
    const billable = Math.max(totalWeight, volumetricWeight);
    if (service.maxWeight && billable > service.maxWeight) continue;
    const surcharge = destination.remote ? (service.remoteSurcharge || 0) : 0;
    const cost = Math.round((service.baseRate + billable * (service.perKgRate || 0) + surcharge) * 100) / 100;
    quotes.push({ service: service.name, billableWeight: billable, cost });
  }

  // SLS 5: Cheapest quote first, stable by service name
  quotes.sort((a, b) => a.cost - b.cost || a.service.localeCompare(b.service));
  return { quotes, rejectedPackages };
}
