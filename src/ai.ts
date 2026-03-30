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

// Progressive tax bracket data per country (simplified but realistic)
// Each entry: [threshold, marginalRate] — income up to threshold taxed at that rate
type TaxBracket = [number, number][];

const TAX_BRACKETS: Record<string, TaxBracket> = {
  "netherlands": [[38441, 0.0937], [75518, 0.3693], [Infinity, 0.4950]],
  "germany": [[11604, 0], [17005, 0.14], [66760, 0.24], [277825, 0.42], [Infinity, 0.45]],
  "france": [[11294, 0], [28797, 0.11], [82341, 0.30], [177106, 0.41], [Infinity, 0.45]],
  "uk": [[12570, 0], [50270, 0.20], [125140, 0.40], [Infinity, 0.45]],
  "united kingdom": [[12570, 0], [50270, 0.20], [125140, 0.40], [Infinity, 0.45]],
  "spain": [[12450, 0.19], [20200, 0.24], [35200, 0.30], [60000, 0.37], [300000, 0.45], [Infinity, 0.47]],
  "italy": [[28000, 0.23], [50000, 0.35], [Infinity, 0.43]],
  "portugal": [[7703, 0.1325], [11623, 0.18], [16472, 0.23], [21321, 0.26], [27146, 0.3275], [39791, 0.37], [51997, 0.435], [81199, 0.45], [Infinity, 0.48]],
  "belgium": [[15200, 0.25], [26830, 0.40], [46440, 0.45], [Infinity, 0.50]],
  "sweden": [[614000 / 12 * 12, 0.32], [Infinity, 0.52]], // simplified
  "denmark": [[46700, 0.12], [Infinity, 0.15]], // + municipal ~25%
  "norway": [[208050, 0.00], [292850, 0.017], [670000, 0.04], [937900, 0.136], [1350000, 0.166], [Infinity, 0.176]],
  "finland": [[19900, 0], [29700, 0.06], [49000, 0.1725], [85800, 0.2125], [Infinity, 0.3125]],
  "ireland": [[42000, 0.20], [Infinity, 0.40]],
  "austria": [[12816, 0], [20818, 0.20], [34513, 0.30], [66612, 0.40], [99266, 0.48], [1000000, 0.50], [Infinity, 0.55]],
  "switzerland": [[17800, 0], [31600, 0.01], [41400, 0.02], [55200, 0.03], [72600, 0.04], [78100, 0.05], [103600, 0.06], [134600, 0.07], [176000, 0.08], [755200, 0.10], [Infinity, 0.115]],
  "usa": [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
  "united states": [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
  "canada": [[55867, 0.15], [111733, 0.205], [154906, 0.26], [220000, 0.29], [Infinity, 0.33]],
  "australia": [[18200, 0], [45000, 0.19], [120000, 0.325], [180000, 0.37], [Infinity, 0.45]],
  "japan": [[1950000, 0.05], [3300000, 0.10], [6950000, 0.20], [9000000, 0.23], [18000000, 0.33], [40000000, 0.40], [Infinity, 0.45]],
  "singapore": [[20000, 0], [30000, 0.02], [40000, 0.035], [80000, 0.07], [120000, 0.115], [160000, 0.15], [200000, 0.18], [240000, 0.19], [280000, 0.195], [320000, 0.20], [Infinity, 0.22]],
  "india": [[300000, 0], [700000, 0.05], [1000000, 0.10], [1200000, 0.15], [1500000, 0.20], [Infinity, 0.30]],
  "brazil": [[24511, 0], [33919, 0.075], [45012, 0.15], [55976, 0.225], [Infinity, 0.275]],
  "new zealand": [[14000, 0.105], [48000, 0.175], [70000, 0.30], [180000, 0.33], [Infinity, 0.39]],
  "greece": [[10000, 0.09], [20000, 0.22], [30000, 0.28], [40000, 0.36], [Infinity, 0.44]],
  "poland": [[120000, 0.12], [Infinity, 0.32]],
  "czech republic": [[Infinity, 0.15]], // flat
  "romania": [[Infinity, 0.10]], // flat
  "hungary": [[Infinity, 0.15]], // flat
  "croatia": [[47780, 0.20], [Infinity, 0.30]],
  "bulgaria": [[Infinity, 0.10]], // flat
  "cyprus": [[19500, 0], [28000, 0.20], [36300, 0.25], [60000, 0.30], [Infinity, 0.35]],
  "malta": [[9100, 0], [14500, 0.15], [19500, 0.25], [60000, 0.25], [Infinity, 0.35]],
  "luxembourg": [[11265, 0], [13173, 0.08], [15009, 0.10], [17145, 0.12], [19386, 0.14], [21690, 0.16], [24402, 0.18], [27144, 0.20], [29946, 0.22], [32748, 0.24], [35550, 0.26], [38352, 0.28], [41154, 0.30], [43956, 0.32], [46758, 0.34], [49560, 0.36], [52362, 0.38], [110403, 0.39], [165600, 0.40], [220788, 0.41], [Infinity, 0.42]],
  "iceland": [[4803459 / 12 * 1, 0.3145], [Infinity, 0.3795]], // simplified
  "estonia": [[Infinity, 0.20]], // flat
  "latvia": [[Infinity, 0.20]], // mostly flat simplified
  "lithuania": [[101094, 0.20], [Infinity, 0.32]],
  "slovenia": [[8755, 0.16], [25750, 0.26], [51500, 0.33], [74160, 0.39], [Infinity, 0.50]],
  "slovakia": [[41445, 0.19], [Infinity, 0.25]],
  "mexico": [[8952, 0.0192], [75984, 0.0640], [133536, 0.1088], [155229, 0.16], [185852, 0.1792], [374837, 0.2136], [590796, 0.2352], [1127926, 0.30], [1503902, 0.32], [4511707, 0.34], [Infinity, 0.35]],
  "south korea": [[14000000, 0.06], [50000000, 0.15], [88000000, 0.24], [150000000, 0.35], [300000000, 0.38], [500000000, 0.40], [1000000000, 0.42], [Infinity, 0.45]],
  "hong kong": [[50000, 0.02], [100000, 0.06], [150000, 0.10], [200000, 0.14], [Infinity, 0.17]],
};

// Pension contribution rates by country (employee portion, approximate)
const PENSION_RATES: Record<string, number> = {
  "netherlands": 5, "germany": 9.3, "france": 11, "uk": 5, "united kingdom": 5,
  "spain": 6.35, "italy": 9.19, "portugal": 11, "belgium": 13.07, "sweden": 7,
  "denmark": 4, "norway": 7.8, "finland": 7.15, "ireland": 4, "austria": 10.25,
  "switzerland": 5.3, "usa": 6.2, "united states": 6.2, "canada": 5.95, "australia": 0,
  "japan": 9.15, "singapore": 20, "india": 12, "brazil": 8, "new zealand": 3,
  "greece": 6.67, "poland": 9.76, "czech republic": 6.5, "romania": 25, "hungary": 18.5,
  "croatia": 20, "bulgaria": 10.58, "cyprus": 8.3, "malta": 10, "luxembourg": 8,
  "iceland": 4, "estonia": 2, "latvia": 10.5, "lithuania": 6.98, "slovenia": 15.5,
  "slovakia": 9.4, "mexico": 1.775, "south korea": 4.5, "hong kong": 5,
};

function calculateEffectiveTaxRate(annualIncome: number, country: string): number | null {
  const brackets = TAX_BRACKETS[country.toLowerCase().trim()];
  if (!brackets) return null;

  let totalTax = 0;
  let prevThreshold = 0;

  for (const [threshold, rate] of brackets) {
    if (annualIncome <= prevThreshold) break;
    const taxableInBracket = Math.min(annualIncome, threshold) - prevThreshold;
    if (taxableInBracket > 0) {
      totalTax += taxableInBracket * rate;
    }
    prevThreshold = threshold;
  }

  if (annualIncome <= 0) return 0;
  return Math.round((totalTax / annualIncome) * 100);
}

function getPensionRate(country: string): number {
  return PENSION_RATES[country.toLowerCase().trim()] ?? 5;
}

export interface TaxEstimate {
  effectiveTaxRate: number;
  pensionContributionPercent: number;
  country: string;
}

export async function estimateTaxes(
  country: string,
  annualIncome: number,
  apiKey: string | null
): Promise<TaxEstimate> {
  const countryLower = country.toLowerCase().trim();

  // Try progressive brackets first
  const bracketRate = calculateEffectiveTaxRate(annualIncome, countryLower);
  if (bracketRate !== null) {
    return {
      effectiveTaxRate: bracketRate,
      pensionContributionPercent: getPensionRate(countryLower),
      country,
    };
  }

  // If we have an API key and unknown country, ask AI
  if (apiKey && country.trim()) {
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
              content: `For someone earning €${annualIncome.toLocaleString()} per year in "${country}", estimate:
1. Their effective income tax rate (as a percentage, accounting for progressive brackets and standard deductions)
2. The mandatory employee pension/social security contribution rate (as a percentage)

Respond with ONLY a JSON object: {"taxRate": <number>, "pensionRate": <number>}. No other text.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content[0].text;
        const taxMatch = text.match(/"taxRate"\s*:\s*([\d.]+)/);
        const pensionMatch = text.match(/"pensionRate"\s*:\s*([\d.]+)/);
        if (taxMatch) {
          return {
            effectiveTaxRate: Math.round(parseFloat(taxMatch[1])),
            pensionContributionPercent: pensionMatch ? Math.round(parseFloat(pensionMatch[1]) * 2) / 2 : 5,
            country,
          };
        }
      }
    } catch {
      // fall through to default
    }
  }

  // Final fallback
  return {
    effectiveTaxRate: 30,
    pensionContributionPercent: 5,
    country,
  };
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
