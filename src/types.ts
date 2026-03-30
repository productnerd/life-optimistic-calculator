export interface IncomeStream {
  name: string;
  monthlyAmount: number;
  annualGrowthRate: number; // % per year
  startsInYears: number; // 0 = now, 3 = starts in 3 years (ignored if linkedTo is set)
  linkedTo: string | null; // null = manual start, "dreamHome" | "holidayHome" | "business-0" etc.
}

export interface InvestmentAllocation {
  name: string;
  percentage: number; // % of invested amount going to this vehicle
  expectedReturn: number; // % annual return
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

  // Tax & Pension
  effectiveTaxRate: number; // % effective tax rate (auto-set from country, user can override)
  pensionContributionPercent: number; // % of gross salary to pension

  // Investment
  investmentPercentage: number; // % of salary invested
  investmentAllocations: InvestmentAllocation[]; // how invested money is split
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
  taxes: number;
  pensionContribution: number;
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
    currentAge: 28,
    targetRetireAge: 55,
    currentSavings: 10000,
    currentInvestments: 5000,
    country: "Netherlands",
    effectiveTaxRate: 30,
    pensionContributionPercent: 5,
    annualSalary: 65000,
    salaryGrowthRate: 3,
    additionalIncome: [],
    partnerSalary: null,
    partnerSalaryGrowth: 2,
    investmentPercentage: 15,
    investmentAllocations: [
      { name: "Stocks (Index Funds)", percentage: 70, expectedReturn: 7 },
      { name: "Bonds", percentage: 20, expectedReturn: 3 },
      { name: "Cash / Savings", percentage: 10, expectedReturn: 1.5 },
    ],
    inflationRate: 2.5,
    dreamHome: { description: "", estimatedPrice: 350000, isLoading: false },
    monthlyRent: 900,
    mortgageRate: 3.5,
    mortgageTerm: 30,
    downPaymentPercent: 15,
    holidayHome: null,
    dreamCar: { description: "", estimatedPrice: 20000, isLoading: false },
    annualCarCosts: 2500,
    numberOfKids: 0,
    kidsAges: [],
    livingExpenses: [
      { name: "Food & Groceries", monthlyAmount: 400 },
      { name: "Utilities & Bills", monthlyAmount: 200 },
      { name: "Transport", monthlyAmount: 150 },
      { name: "Software & Subscriptions", monthlyAmount: 50 },
      { name: "Shopping & Clothing", monthlyAmount: 100 },
      { name: "Health & Fitness", monthlyAmount: 60 },
      { name: "Entertainment & Dining Out", monthlyAmount: 200 },
      { name: "Insurance", monthlyAmount: 150 },
      { name: "Personal Care", monthlyAmount: 80 },
    ],
    hobbies: [],
    bigPurchases: [],
    businesses: [],
    techUpgradeCycle: 3,
    techUpgradeCost: 2000,
    tripsPerYear: 2,
    avgCostPerTrip: 1200,
    travelKidsMultiplier: 0.5,
    expectedInheritance: 0,
    familyGiftAmount: 0,
    familyGiftInterval: 10,
    miniRetirements: 1,
    miniRetirementDuration: 3,
    miniRetirementStopSideIncome: false,
  };
}
