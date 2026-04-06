// Annual costs for hobbies/activities (EUR per year)
const HOBBY_ANNUAL_COSTS: Record<string, number> = {
  // Sports - Team
  football: 500, soccer: 500, basketball: 600, volleyball: 400, rugby: 600,
  hockey: 1200, "ice hockey": 1500, cricket: 500, baseball: 600, softball: 400,
  handball: 400, "water polo": 800, lacrosse: 700, "field hockey": 500,
  // Sports - Individual
  tennis: 1500, padel: 1200, badminton: 600, squash: 800, "table tennis": 400,
  golf: 3000, swimming: 800, running: 500, cycling: 1200, triathlon: 2000,
  boxing: 1000, kickboxing: 900, "muay thai": 1000, mma: 1200, karate: 800,
  judo: 700, "brazilian jiu-jitsu": 1200, bjj: 1200, taekwondo: 800, fencing: 1000,
  wrestling: 600, "martial arts": 900, "kung fu": 800,
  climbing: 1500, "rock climbing": 1500, bouldering: 1000, mountaineering: 2500,
  skiing: 3000, snowboarding: 2500, "cross-country skiing": 1500,
  surfing: 1500, kitesurfing: 2500, windsurfing: 2000, wakeboarding: 1500,
  sailing: 4000, rowing: 1200, canoeing: 800, kayaking: 800, paddleboarding: 600,
  diving: 2000, "scuba diving": 2500, snorkeling: 500,
  skating: 600, "ice skating": 800, "roller skating": 500, skateboarding: 400,
  archery: 1000, shooting: 1500, "target shooting": 1200,
  athletics: 500, "track and field": 500, gymnastics: 1200, trampolining: 600,
  // Fitness
  gym: 600, crossfit: 1500, pilates: 1200, yoga: 1000, "hot yoga": 1500,
  "personal trainer": 3000, "personal training": 3000, fitness: 700,
  weightlifting: 600, powerlifting: 800, bodybuilding: 1000, calisthenics: 400,
  spinning: 1000, aerobics: 600, zumba: 600, "pole dancing": 1000, barre: 1200,
  // Water
  "scuba": 2500, fishing: 1000, "fly fishing": 1500, spearfishing: 1200,
  // Outdoor & Adventure
  hiking: 500, trekking: 1000, camping: 800, backpacking: 1500,
  "horse riding": 3500, horseback: 3500, equestrian: 4000, polo: 8000,
  skydiving: 3000, paragliding: 2500, "hang gliding": 2000, parachuting: 3000,
  "bungee jumping": 500, "base jumping": 3000,
  "mountain biking": 1500, motocross: 3000,
  hunting: 2000, "bird watching": 300, orienteering: 400,
  // Music
  piano: 1500, "piano lessons": 1800, guitar: 1000, "guitar lessons": 1200,
  violin: 1500, "violin lessons": 1800, cello: 1500, drums: 1200,
  singing: 1200, "voice lessons": 1500, "vocal coaching": 2000,
  saxophone: 1200, trumpet: 1000, flute: 1000, clarinet: 1000,
  "music lessons": 1500, "music production": 1000, dj: 800, djing: 800,
  choir: 300, orchestra: 500, "band": 600,
  // Arts & Crafts
  painting: 800, drawing: 500, "oil painting": 1000, watercolor: 600,
  sculpture: 1000, pottery: 800, ceramics: 900, woodworking: 1200,
  knitting: 300, crochet: 250, sewing: 500, quilting: 500, embroidery: 300,
  calligraphy: 400, "leather crafting": 600, "jewelry making": 700,
  photography: 1500, "film photography": 2000, videography: 1200,
  "graphic design": 500, "digital art": 400, "3d printing": 800,
  // Dance
  dance: 1000, ballet: 1200, salsa: 800, tango: 900, "ballroom dancing": 1000,
  "contemporary dance": 1000, "hip hop dance": 800, "flamenco": 900,
  "swing dancing": 700, "latin dance": 800, breakdancing: 600,
  // Mind & Strategy
  chess: 300, "board games": 400, "video games": 600, gaming: 800,
  poker: 1000, bridge: 300, "escape rooms": 500,
  // Languages & Learning
  "language course": 800, "language lessons": 1000, "spanish lessons": 1000,
  "french lessons": 1000, "german lessons": 1000, "japanese lessons": 1200,
  "chinese lessons": 1200, "italian lessons": 1000, "arabic lessons": 1200,
  coding: 500, programming: 500, "online courses": 600, "book club": 200,
  // Wellness & Mindfulness
  meditation: 500, "tai chi": 600, qigong: 500, reiki: 800,
  massage: 1500, "spa membership": 2000, "float tank": 1000,
  // Social & Entertainment
  "wine tasting": 1500, "wine club": 1000, "beer brewing": 600, "home brewing": 500,
  cooking: 800, "cooking class": 1200, "baking": 500, "cocktail making": 600,
  reading: 300, writing: 300, "creative writing": 500,
  blogging: 200, vlogging: 500, podcasting: 800, streaming: 600,
  "stand-up comedy": 500, "improv": 600, acting: 1000, theater: 800,
  // Collecting
  "stamp collecting": 500, "coin collecting": 1000, "card collecting": 800,
  "antiques": 2000, "vintage": 1500, "art collecting": 5000,
  // Motorsport
  karting: 3000, "go-kart": 2000, "car racing": 5000, "track days": 3000,
  "sim racing": 800, rallying: 5000,
  // Flying
  flying: 8000, "flight lessons": 10000, "private pilot": 12000,
  "drone flying": 800, "model aircraft": 600,
  // Animals
  "dog training": 800, "dog agility": 600, "pet care": 1000,
  "bird keeping": 500, aquarium: 600, "fish keeping": 500,
  // Garden
  gardening: 500, "vegetable garden": 400, bonsai: 600, "bee keeping": 800,
  // Misc
  astronomy: 600, "star gazing": 300, "metal detecting": 500, geocaching: 300,
  "magic tricks": 400, juggling: 200, circus: 800,
};

const FALLBACK_PRICES: Record<string, Record<string, number>> = {
  car: {
    default: 25000,
    // Motorcycles
    "cafe racer": 12000, motorcycle: 10000, "harley": 18000, "ducati": 16000,
    vespa: 5000, scooter: 3000, "triumph": 12000, "indian": 20000,
    // Cars
    porsche: 55000, "porsche 911": 95000, "porsche cayenne": 80000, "porsche macan": 65000,
    bmw: 45000, "bmw m3": 75000, "bmw x5": 65000, "bmw 3": 42000, "bmw 5": 55000,
    tesla: 40000, "tesla model 3": 38000, "tesla model y": 45000, "tesla model s": 80000, "tesla model x": 90000,
    toyota: 25000, "toyota corolla": 22000, "toyota camry": 28000, "toyota rav4": 32000, "toyota land cruiser": 65000,
    honda: 22000, "honda civic": 24000, "honda cr-v": 32000,
    mercedes: 50000, "mercedes c": 45000, "mercedes e": 60000, "mercedes s": 100000, "mercedes amg": 85000, "mercedes g": 130000,
    audi: 42000, "audi a3": 35000, "audi a4": 42000, "audi a6": 55000, "audi q5": 50000, "audi rs": 85000,
    volkswagen: 28000, "golf": 30000, "tiguan": 35000, "passat": 35000,
    fiat: 18000, "fiat 500": 16000,
    volvo: 38000, "volvo xc90": 60000, "volvo xc60": 48000,
    mini: 28000, "mini cooper": 30000,
    "range rover": 90000, "land rover": 55000, "defender": 60000,
    mazda: 28000, subaru: 30000, kia: 25000, hyundai: 25000,
    "ford mustang": 45000, "ford": 30000, "jeep": 40000, "jeep wrangler": 50000,
    ferrari: 250000, lamborghini: 250000, maserati: 90000, "aston martin": 160000,
    lexus: 45000, infiniti: 40000, jaguar: 55000, bentley: 200000, "rolls royce": 350000,
    // Vintage & Classic
    "alfa romeo": 45000, "alfa romeo gt": 65000, "alfa romeo spider": 55000,
    "vintage": 45000, "classic": 40000, "1960s": 55000, "1970s": 45000, "1950s": 70000,
    "mv agusta": 15000, "cafe racer bmw": 18000,
  },
  "residential property": {
    default: 300000,
    // Europe
    lisbon: 350000, porto: 280000, algarve: 320000,
    london: 550000, manchester: 280000, edinburgh: 300000, bristol: 350000,
    paris: 500000, lyon: 300000, nice: 400000, bordeaux: 320000, marseille: 280000,
    berlin: 400000, munich: 550000, hamburg: 400000, frankfurt: 450000, cologne: 350000,
    amsterdam: 450000, rotterdam: 350000, utrecht: 380000, "the hague": 380000,
    madrid: 320000, barcelona: 380000, valencia: 250000, malaga: 260000, seville: 220000,
    rome: 350000, milan: 420000, florence: 380000, naples: 200000, bologna: 300000,
    dublin: 400000, cork: 300000,
    vienna: 380000, salzburg: 350000,
    zurich: 800000, geneva: 750000, bern: 600000, basel: 550000,
    stockholm: 400000, copenhagen: 420000, oslo: 450000, helsinki: 350000,
    prague: 250000, warsaw: 200000, budapest: 180000, bucharest: 150000,
    athens: 200000, thessaloniki: 160000,
    // Americas
    "new york": 700000, "san francisco": 800000, "los angeles": 650000, miami: 450000,
    chicago: 350000, boston: 550000, seattle: 550000, austin: 400000, denver: 450000,
    toronto: 600000, vancouver: 700000, montreal: 400000,
    "mexico city": 200000, "buenos aires": 150000, "sao paulo": 250000,
    // Asia/Pacific
    tokyo: 500000, singapore: 800000, "hong kong": 900000, sydney: 700000, melbourne: 550000,
    dubai: 400000, bangkok: 200000, bali: 250000,
    // Generic
    apartment: 250000, studio: 180000, cottage: 200000, villa: 500000, farmhouse: 350000,
    penthouse: 600000, townhouse: 350000, loft: 300000, mansion: 1200000, flat: 250000,
    countryside: 220000, "beach house": 400000, cabin: 150000, chalet: 350000,
  },
  "business startup cost": {
    default: 30000,
    "coffee shop": 80000, cafe: 70000, restaurant: 150000, bar: 100000, pub: 120000,
    bakery: 60000, pizzeria: 100000, brewery: 200000, winery: 300000,
    saas: 15000, "software": 20000, app: 25000, "mobile app": 30000, "web app": 15000,
    "online store": 10000, "e-commerce": 15000, "dropshipping": 5000, etsy: 3000,
    consulting: 5000, freelancing: 2000, coaching: 3000, agency: 15000,
    gym: 100000, "fitness studio": 60000, yoga: 30000, "crossfit": 80000, pilates: 40000,
    "food truck": 50000, "ice cream": 40000, "juice bar": 45000,
    salon: 40000, barber: 25000, spa: 80000, "beauty salon": 45000,
    "real estate": 20000, "property management": 10000, airbnb: 5000,
    "photography": 8000, "video production": 15000, "podcast": 5000,
    "clothing brand": 20000, "fashion": 25000, "jewelry": 10000,
    "landscaping": 15000, "cleaning": 8000, "plumbing": 12000, "electrician": 15000,
    "dental": 250000, "medical": 300000, pharmacy: 200000, "veterinary": 150000,
    "daycare": 80000, "tutoring": 5000, "school": 150000,
    "hotel": 500000, "hostel": 150000, "bed and breakfast": 100000, "b&b": 100000,
    "car wash": 50000, "auto repair": 60000, "mechanic": 40000,
    "bookstore": 30000, "florist": 25000, "pet shop": 35000,
    "laundromat": 80000, "vending": 20000, "franchise": 100000,
  },
  "luxury item": {
    default: 5000,
    // Furniture
    couch: 2000, sofa: 2000, "sectional": 3500, "leather sofa": 4000,
    "dining table": 1500, desk: 800, "standing desk": 1200, "office chair": 800, chair: 500,
    bed: 1500, mattress: 1200, wardrobe: 1000, bookshelf: 400, dresser: 800,
    "kitchen": 15000, "kitchen renovation": 15000,
    // Electronics
    "macbook": 2500, laptop: 1500, "gaming pc": 2000, "desktop": 1500, computer: 1500,
    iphone: 1200, phone: 800, ipad: 800, tablet: 600,
    tv: 1000, "oled tv": 2000, "home theater": 5000, projector: 1500,
    camera: 2000, "sony camera": 2500, "canon": 2000, "drone": 1500,
    "ps5": 500, playstation: 500, xbox: 500, "nintendo switch": 350, "gaming console": 500,
    // Instruments
    piano: 5000, "grand piano": 15000, "upright piano": 4000, keyboard: 1000,
    guitar: 1000, "electric guitar": 1500, "acoustic guitar": 800, "bass guitar": 1200,
    drums: 2000, violin: 2000, saxophone: 3000, trumpet: 1500, cello: 4000,
    // Sports & Outdoor
    bicycle: 1500, "road bike": 3000, "mountain bike": 2500, "e-bike": 3500, "electric bike": 3500,
    kayak: 1000, paddleboard: 800, surfboard: 600, "sup": 800,
    "home gym": 3000, treadmill: 1500, "peloton": 2000, "rowing machine": 1200,
    "ski equipment": 1500, skis: 800, snowboard: 600, "golf clubs": 2000,
    // Luxury
    watch: 5000, rolex: 10000, omega: 5000, "tag heuer": 3000, "apple watch": 500,
    jewelry: 3000, ring: 2000, "engagement ring": 5000, necklace: 1500, bracelet: 1000, earrings: 800,
    handbag: 2000, "louis vuitton": 3000, "hermes": 8000, "chanel": 5000, "gucci": 2500,
    "designer": 2000, sunglasses: 300,
    // Vehicles & Toys
    boat: 30000, sailboat: 40000, yacht: 200000, "jet ski": 12000,
    "atv": 8000, "quad": 8000, "snowmobile": 10000,
    "camper": 50000, "rv": 60000, "caravan": 25000, "motorhome": 70000, "van": 40000, "campervan": 45000,
    // Home
    "hot tub": 5000, jacuzzi: 6000, sauna: 4000, "swimming pool": 25000, pool: 25000,
    "solar panels": 10000, "home office": 5000,
    "art": 3000, painting: 2000, sculpture: 3000,
    "wine collection": 5000, "wine cellar": 15000,
  },
};

function getFallbackPrice(description: string, category: string): number {
  const desc = description.toLowerCase();

  // For hobbies, search the dedicated hobby annual cost database first
  if (category === "hobby") {
    // Try longest match first for specificity (e.g. "piano lessons" before "piano")
    const sortedEntries = Object.entries(HOBBY_ANNUAL_COSTS).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [key, price] of sortedEntries) {
      if (desc.includes(key)) {
        return price;
      }
    }
    // Generic hobby fallback: cheap/moderate/expensive keyword detection
    if (/lesson|class|course|coach|train/.test(desc)) return 1200;
    if (/membership|club|subscription/.test(desc)) return 800;
    if (/extreme|adventure|flying|aviation|pilot/.test(desc)) return 5000;
    if (/water|boat|marine|nautical/.test(desc)) return 2000;
    if (/motor|racing|speed/.test(desc)) return 3000;
    return 800; // reasonable default for an annual hobby cost
  }

  // First try the specified category
  const catPrices = FALLBACK_PRICES[category] ?? {};
  // Sort by key length descending for better specificity
  const sortedCat = Object.entries(catPrices).sort((a, b) => b[0].length - a[0].length);
  for (const [key, price] of sortedCat) {
    if (key !== "default" && desc.includes(key)) {
      return price;
    }
  }

  // Then search ALL categories for a match
  for (const [cat, prices] of Object.entries(FALLBACK_PRICES)) {
    if (cat === category) continue;
    const sorted = Object.entries(prices).sort((a, b) => b[0].length - a[0].length);
    for (const [key, price] of sorted) {
      if (key !== "default" && desc.includes(key)) {
        return price;
      }
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
  _apiKey: string | null
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

  // Ask AI via Supabase proxy for unknown countries
  if (country.trim()) {
    const prompt = `For someone earning €${annualIncome.toLocaleString()} per year in "${country}", estimate:
1. Their effective income tax rate (as a percentage, accounting for progressive brackets and standard deductions)
2. The mandatory employee pension/social security contribution rate (as a percentage)

Respond with ONLY a JSON object: {"taxRate": <number>, "pensionRate": <number>}. No other text.`;

    const text = await callAI(prompt);
    if (text) {
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
  }

  // Final fallback
  return {
    effectiveTaxRate: 30,
    pensionContributionPercent: 5,
    country,
  };
}

const SUPABASE_PROXY_URL = "https://knftyqkhampkqchoncel.supabase.co/functions/v1/estimate-price";

function buildPricePrompt(description: string, category: string): string {
  if (category === "hobby") {
    return `Estimate the TOTAL ANNUAL cost in EUR for someone actively doing "${description}" as a regular hobby in Europe. This person does it EVERY WEEK or at least multiple times per month throughout the year. Include ALL yearly costs: club/gym membership, equipment purchase and replacement, lessons/coaching, travel to locations, gear maintenance, insurance, competition fees, consumables, permits/licenses. Add it ALL up for a full year. Be realistic — hobbies are expensive! For example: golf costs ~€3000/yr, sailing ~€4000/yr, horse riding ~€3500/yr, skydiving ~€3000/yr. Respond with ONLY: {"price": <number>}`;
  }
  return `You are a price estimation assistant. Estimate the current market price in EUR for: "${description}" (category: ${category}). Consider the European market. If this is a vintage, classic, or collector's item, price it at current collector market value, NOT original retail price. Respond with ONLY a JSON object: {"price": <number>}. No other text.`;
}

async function callAI(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(SUPABASE_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.text ?? null;
  } catch {
    return null;
  }
}

export async function estimatePrice(
  description: string,
  category: string,
  _apiKey: string | null
): Promise<number> {
  if (!description.trim()) return getFallbackPrice(description, category);

  // Always try the Supabase proxy first (uses server-side API key)
  const prompt = buildPricePrompt(description, category);
  const text = await callAI(prompt);
  if (text) {
    const match = text.match(/"price"\s*:\s*(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Fallback to local database
  return getFallbackPrice(description, category);
}
