export interface IncomeStream {
  name: string;
  monthlyAmount: number;
  annualGrowthRate: number; // % per year
  startsInYears: number; // 0 = now, 3 = starts in 3 years
}

export interface ExpenseCategory {
  name: string;
  monthlyAmount: number;
}

export interface DreamInputs {
  // Personal
  currentAge: number;
  targetRetireAge: number;
  currentSavings: number;
  currentInvestments: number;
  country: string;

  // Income
  annualSalary: number;
  salaryGrowthRate: number; // % per year
  additionalIncome: IncomeStream[];
  partnerSalary: number | null; // null = no partner, 0+ = partner salary
  partnerSalaryGrowth: number;

  // Investment
  investmentPercentage: number; // % of salary invested
  expectedReturn: number; // % annual return
  inflationRate: number;

  // Housing
  dreamHome: AIPricedItem;
  monthlyRent: number; // rent until mortgage
  mortgageRate: number;
  mortgageTerm: number; // years
  downPaymentPercent: number;
  holidayHome: AIPricedItem | null;

  // Car
  dreamCar: AIPricedItem;
  annualCarCosts: number; // insurance, fuel, maintenance

  // Family
  numberOfKids: number;
  kidsAges: number[]; // current ages or negative = years until born

  // Lifestyle
  livingExpenses: ExpenseCategory[];
  hobbies: AIPricedItem[];
  bigPurchases: AIPricedItem[];
  businesses: AIPricedItem[];

  // Technology
  techUpgradeCycle: number; // years between upgrades
  techUpgradeCost: number; // total cost per cycle (laptop + phone)

  // Travel
  tripsPerYear: number;
  avgCostPerTrip: number;
  travelKidsMultiplier: number; // extra cost per kid per trip (multiplier)

  // Inheritance & Family Gifts
  expectedInheritance: number; // lump sum at age 65 (parents 25 at birth, live to 90)
  familyGiftAmount: number; // gift amount received every X years
  familyGiftInterval: number; // years between gifts (e.g. 10 = every decade)

  // Mini-retirements
  miniRetirements: number; // number of mini-retirements
  miniRetirementDuration: number; // duration in months
  miniRetirementStopSideIncome: boolean; // true = side income also stops during mini-retirement
}

export interface AIPricedItem {
  description: string;
  estimatedPrice: number | null;
  isLoading: boolean;
}

export interface YearlySnapshot {
  year: number;
  age: number;
  // Income
  salary: number;
  investmentIncome: number;
  totalIncome: number;
  // Expenses
  housing: number; // rent or mortgage
  carExpenses: number;
  kidsCosts: number;
  livingExpenses: number;
  hobbyCosts: number;
  travelCosts: number;
  otherExpenses: number;
  totalExpenses: number;
  // Balances
  amountInvested: number;
  portfolioValue: number;
  netWorth: number;
  // Flags
  isWorking: boolean;
  isMiniRetirement: boolean;
  milestones: string[];
}

export interface SimulationResult {
  yearlySnapshots: YearlySnapshot[];
  totalLifetimeCost: number;
  yearsToGoal: number;
  goalReachedAge: number;
  dreamLifeAnnualCost: number;
  dreamLifeAchievableAge: number | null;
  dreamEntrepreneurialAge: number | null;
  totalAssetsCost: number; // house, car, businesses, big purchases
  totalKidsCost: number; // cumulative child-rearing costs
}

export function createDefaultInputs(): DreamInputs {
  return {
    currentAge: 25,
    targetRetireAge: 55,
    currentSavings: 5000,
    currentInvestments: 0,
    country: "Europe",
    annualSalary: 50000,
    salaryGrowthRate: 2,
    additionalIncome: [],
    partnerSalary: null,
    partnerSalaryGrowth: 2,
    investmentPercentage: 20,
    expectedReturn: 7,
    inflationRate: 2.5,
    dreamHome: { description: "", estimatedPrice: 300000, isLoading: false },
    monthlyRent: 1000,
    mortgageRate: 3.5,
    mortgageTerm: 25,
    downPaymentPercent: 20,
    holidayHome: null,
    dreamCar: { description: "", estimatedPrice: 25000, isLoading: false },
    annualCarCosts: 3000,
    numberOfKids: 1,
    kidsAges: [-3],
    livingExpenses: [
      { name: "Food & Groceries", monthlyAmount: 500 },
      { name: "Utilities & Bills", monthlyAmount: 250 },
      { name: "Transport", monthlyAmount: 200 },
      { name: "Software & Subscriptions", monthlyAmount: 100 },
      { name: "Shopping & Clothing", monthlyAmount: 200 },
      { name: "Health & Fitness", monthlyAmount: 100 },
      { name: "Entertainment & Dining Out", monthlyAmount: 300 },
      { name: "Insurance", monthlyAmount: 200 },
      { name: "Personal Care", monthlyAmount: 150 },
    ],
    hobbies: [],
    bigPurchases: [],
    businesses: [],
    techUpgradeCycle: 3,
    techUpgradeCost: 2500,
    tripsPerYear: 2,
    avgCostPerTrip: 1500,
    travelKidsMultiplier: 0.5,
    expectedInheritance: 0,
    familyGiftAmount: 0,
    familyGiftInterval: 10,
    miniRetirements: 1,
    miniRetirementDuration: 6,
    miniRetirementStopSideIncome: false,
  };
}
