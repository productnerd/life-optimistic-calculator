const FALLBACK_PRICES: Record<string, Record<string, number>> = {
  car: {
    default: 25000,
    porsche: 55000,
    "porsche 911": 65000,
    bmw: 45000,
    tesla: 40000,
    "tesla model 3": 38000,
    toyota: 25000,
    honda: 22000,
    mercedes: 50000,
    audi: 42000,
    volkswagen: 28000,
    fiat: 18000,
    volvo: 38000,
    mini: 28000,
  },
  "residential property": {
    default: 300000,
    lisbon: 350000,
    porto: 280000,
    london: 550000,
    paris: 500000,
    berlin: 400000,
    amsterdam: 450000,
    madrid: 320000,
    barcelona: 380000,
    rome: 350000,
    milan: 420000,
    dublin: 400000,
    munich: 500000,
    vienna: 380000,
    zurich: 800000,
    "new york": 700000,
    stockholm: 400000,
  },
  "holiday property": {
    default: 180000,
  },
  "business startup cost": {
    default: 30000,
    "coffee shop": 80000,
    restaurant: 150000,
    saas: 15000,
    "online store": 10000,
    consulting: 5000,
    bakery: 60000,
    gym: 100000,
    "food truck": 50000,
  },
};

function getFallbackPrice(description: string, category: string): number {
  const desc = description.toLowerCase();
  const catPrices = FALLBACK_PRICES[category] ?? {};

  for (const [key, price] of Object.entries(catPrices)) {
    if (key !== "default" && desc.includes(key)) {
      return price;
    }
  }

  return catPrices["default"] ?? 30000;
}

export async function estimatePrice(
  description: string,
  category: string,
  apiKey: string | null
): Promise<number> {
  if (!description.trim()) return getFallbackPrice(description, category);

  if (!apiKey) {
    // Use fallback pricing
    return getFallbackPrice(description, category);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: `You are a price estimation assistant. Estimate the current market price in EUR for: "${description}" (category: ${category}).

Consider the European market. Respond with ONLY a JSON object: {"price": <number>}. No other text.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return getFallbackPrice(description, category);
    }

    const data = await response.json();
    const text = data.content[0].text;
    const match = text.match(/"price"\s*:\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return getFallbackPrice(description, category);
  } catch {
    return getFallbackPrice(description, category);
  }
}
