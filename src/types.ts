export interface DreamInputs {
  // Personal
  currentAge: number;
  targetRetireAge: number;
  currentSavings: number;
  country: string;

  // Income
  annualSalary: number;
  salaryGrowthRate: number; // % per year

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
  monthlyLivingExpenses: number;
  hobbies: AIPricedItem[];
  bigPurchases: AIPricedItem[];
  startBusiness: AIPricedItem | null;

  // Mini-retirements
  miniRetirements: number; // number of 6-month breaks
  miniRetirementSpacing: number; // years between breaks
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
}

export function createDefaultInputs(): DreamInputs {
  return {
    currentAge: 25,
    targetRetireAge: 55,
    currentSavings: 5000,
    country: "Europe",
    annualSalary: 50000,
    salaryGrowthRate: 2,
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
    kidsAges: [-3], // planning to have a kid in 3 years
    monthlyLivingExpenses: 2000,
    hobbies: [],
    bigPurchases: [],
    startBusiness: null,
    miniRetirements: 1,
    miniRetirementSpacing: 10,
  };
}
