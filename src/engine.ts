import type { DreamInputs, YearlySnapshot, SimulationResult } from "./types";

// Average cost per child per year (in EUR, base year)
function childYearlyCost(childAge: number): number {
  if (childAge < 0) return 0;
  if (childAge <= 5) return 8000;
  if (childAge <= 12) return 10000;
  if (childAge <= 17) return 12000;
  if (childAge <= 21) return 15000;
  return 0;
}

// Returns a map of year -> fraction of year spent on mini-retirement (0 to 1)
function getMiniRetirementYears(
  inputs: DreamInputs,
  workingYears: number
): Map<number, number> {
  const yearFractions = new Map<number, number>();
  if (inputs.miniRetirements <= 0 || inputs.miniRetirementDuration <= 0) return yearFractions;

  const durationMonths = inputs.miniRetirementDuration;
  const spacing = Math.floor(workingYears / (inputs.miniRetirements + 1));

  for (let i = 0; i < inputs.miniRetirements; i++) {
    const startYear = spacing * (i + 1);
    if (startYear >= workingYears) break;

    let remainingMonths = durationMonths;
    let currentYear = startYear;
    while (remainingMonths > 0 && currentYear < workingYears) {
      const monthsThisYear = Math.min(remainingMonths, 12);
      const existing = yearFractions.get(currentYear) ?? 0;
      yearFractions.set(currentYear, Math.min(existing + monthsThisYear / 12, 1));
      remainingMonths -= monthsThisYear;
      currentYear++;
    }
  }
  return yearFractions;
}

// Count active kids (age 0-21) for a given simulation year
function countActiveKids(inputs: DreamInputs, simulationYear: number): number {
  let count = 0;
  for (let k = 0; k < inputs.numberOfKids; k++) {
    const kidStartAge = inputs.kidsAges[k] ?? -2 * (k + 1);
    const kidCurrentAge = kidStartAge + simulationYear;
    if (kidCurrentAge >= 0 && kidCurrentAge <= 21) count++;
  }
  return count;
}

export function runSimulation(inputs: DreamInputs): SimulationResult {
  const workingYearsCount = Math.max(inputs.targetRetireAge - inputs.currentAge, 1);
  const totalYears = Math.max(80 - inputs.currentAge, workingYearsCount);
  const snapshots: YearlySnapshot[] = [];

  // Calculate mortgage
  const homePrice = inputs.dreamHome.estimatedPrice ?? 300000;
  const downPayment = homePrice * (inputs.downPaymentPercent / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyMortgageRate = inputs.mortgageRate / 100 / 12;
  const numPayments = inputs.mortgageTerm * 12;
  const monthlyMortgage =
    monthlyMortgageRate > 0
      ? (loanAmount *
          (monthlyMortgageRate *
            Math.pow(1 + monthlyMortgageRate, numPayments))) /
        (Math.pow(1 + monthlyMortgageRate, numPayments) - 1)
      : loanAmount / numPayments;
  const annualMortgage = monthlyMortgage * 12;

  // Holiday home mortgage
  let annualHolidayMortgage = 0;
  if (inputs.holidayHome?.estimatedPrice) {
    const hhPrice = inputs.holidayHome.estimatedPrice;
    const hhDown = hhPrice * (inputs.downPaymentPercent / 100);
    const hhLoan = hhPrice - hhDown;
    const hhMonthly =
      monthlyMortgageRate > 0
        ? (hhLoan *
            (monthlyMortgageRate *
              Math.pow(1 + monthlyMortgageRate, numPayments))) /
          (Math.pow(1 + monthlyMortgageRate, numPayments) - 1)
        : hhLoan / numPayments;
    annualHolidayMortgage = hhMonthly * 12;
  }

  const carPrice = inputs.dreamCar.estimatedPrice ?? 25000;

  // Business costs — sum of all businesses
  const totalBusinessCost = inputs.businesses.reduce(
    (sum, b) => sum + (b.estimatedPrice ?? 0),
    0
  );

  const totalHobbyCost = inputs.hobbies.reduce(
    (sum, h) => sum + (h.estimatedPrice ?? 0),
    0
  );

  const totalBigPurchases = inputs.bigPurchases.reduce(
    (sum, p) => sum + (p.estimatedPrice ?? 0),
    0
  );
  const bigPurchaseAnnual = totalBigPurchases / Math.min(10, workingYearsCount);

  const miniRetYears = getMiniRetirementYears(inputs, workingYearsCount);

  let houseBoughtYear = -1;
  let holidayHomeBoughtYear = -1;
  let dreamLifeAchievableAge: number | null = null;
  let dreamEntrepreneurialAge: number | null = null;
  const inheritanceAge = 65; // parents 25 at birth, live to 90
  let portfolioValue = inputs.currentSavings + inputs.currentInvestments;
  let totalLifetimeCost = 0;

  for (let y = 0; y < totalYears; y++) {
    const age = inputs.currentAge + y;
    const inflationMultiplier = Math.pow(1 + inputs.inflationRate / 100, y);
    const isRetired = age >= inputs.targetRetireAge;
    const miniRetFraction = isRetired ? 0 : (miniRetYears.get(y) ?? 0);
    const isMiniRetirement = miniRetFraction > 0;
    const isWorking = !isRetired && miniRetFraction < 1;
    const workingFraction = isRetired ? 0 : 1 - miniRetFraction;

    // Income
    const salaryGrowthMultiplier = Math.pow(1 + inputs.salaryGrowthRate / 100, y);

    // Additional income with per-stream growth and start year (continues after retirement)
    // If linkedTo an asset, income starts when that asset is acquired
    const additionalIncomeTotal = inputs.additionalIncome.reduce(
      (sum, s) => {
        let startYear: number;
        if (s.linkedTo) {
          if (s.linkedTo === "dreamHome") {
            if (houseBoughtYear < 0) return sum; // not bought yet
            startYear = houseBoughtYear;
          } else if (s.linkedTo === "holidayHome") {
            if (holidayHomeBoughtYear < 0) return sum;
            startYear = holidayHomeBoughtYear;
          } else if (s.linkedTo.startsWith("business-")) {
            // Businesses start in year 2
            if (y < 2) return sum;
            startYear = 2;
          } else {
            startYear = s.startsInYears ?? 0;
          }
        } else {
          startYear = s.startsInYears ?? 0;
        }
        if (y < startYear) return sum;
        const yearsActive = y - startYear;
        return sum + s.monthlyAmount * 12 * Math.pow(1 + s.annualGrowthRate / 100, yearsActive);
      },
      0
    );

    // Partner salary (stops at retirement)
    const partnerIncome = !isRetired && inputs.partnerSalary !== null
      ? inputs.partnerSalary * Math.pow(1 + inputs.partnerSalaryGrowth / 100, y)
      : 0;

    const baseSalary = inputs.annualSalary * salaryGrowthMultiplier;
    // No salary during mini-retirement or after retirement
    // Side income stops during mini-retirement only if flag is set
    const sideIncomeMultiplier = inputs.miniRetirementStopSideIncome ? workingFraction : 1;
    const grossSalary = baseSalary * workingFraction + additionalIncomeTotal * sideIncomeMultiplier + partnerIncome;

    // Taxes and pension (only on earned income, not investment income)
    const taxes = grossSalary * (inputs.effectiveTaxRate / 100);
    const pensionContribution = (baseSalary * workingFraction + partnerIncome) * (inputs.pensionContributionPercent / 100);
    const salary = grossSalary - taxes - pensionContribution;

    const investmentIncome = portfolioValue * (inputs.expectedReturn / 100);

    // Housing
    let housing = 0;
    const milestones: string[] = [];

    if (houseBoughtYear < 0) {
      housing = inputs.monthlyRent * 12 * inflationMultiplier;
      if (portfolioValue >= downPayment && y >= 1) {
        houseBoughtYear = y;
        portfolioValue -= downPayment;
        housing = annualMortgage;
        milestones.push("🏠 Bought dream home!");
      }
    } else if (y - houseBoughtYear < inputs.mortgageTerm) {
      housing = annualMortgage;
    } else {
      if (y - houseBoughtYear === inputs.mortgageTerm) {
        milestones.push("🎉 Mortgage paid off!");
      }
      housing = 2000 * inflationMultiplier;
    }

    // Holiday home
    let holidayHousing = 0;
    if (inputs.holidayHome?.estimatedPrice) {
      const hhDownPayment =
        inputs.holidayHome.estimatedPrice * (inputs.downPaymentPercent / 100);
      if (holidayHomeBoughtYear < 0) {
        if (
          houseBoughtYear >= 0 &&
          portfolioValue >= hhDownPayment &&
          y >= houseBoughtYear + 3
        ) {
          holidayHomeBoughtYear = y;
          portfolioValue -= hhDownPayment;
          holidayHousing = annualHolidayMortgage;
          milestones.push("🏖️ Bought holiday home!");
        }
      } else if (y - holidayHomeBoughtYear < inputs.mortgageTerm) {
        holidayHousing = annualHolidayMortgage;
      } else {
        holidayHousing = 1500 * inflationMultiplier;
      }
    }
    housing += holidayHousing;

    // Car (replaced every 15 years)
    let carExpenses = inputs.annualCarCosts * inflationMultiplier;
    if (y === 0) {
      carExpenses += carPrice;
      milestones.push("🚗 Bought dream car!");
    }
    if (y > 0 && y % 15 === 0) {
      carExpenses += carPrice * inflationMultiplier;
      milestones.push("🚗 Replaced car");
    }

    // Home renovation (every 20 years, 10% of home value)
    if (houseBoughtYear >= 0 && y > houseBoughtYear) {
      const yearsOwned = y - houseBoughtYear;
      if (yearsOwned > 0 && yearsOwned % 20 === 0) {
        const renovationCost = homePrice * 0.1 * inflationMultiplier;
        housing += renovationCost;
        milestones.push("🔨 Home renovation");
      }
    }

    // Kids
    let kidsCosts = 0;
    for (let k = 0; k < inputs.numberOfKids; k++) {
      const kidStartAge = inputs.kidsAges[k] ?? -2 * (k + 1);
      const kidCurrentAge = kidStartAge + y;
      if (kidCurrentAge === 0) milestones.push(`👶 Child ${k + 1} born!`);
      if (kidCurrentAge === 18) milestones.push(`🎓 Child ${k + 1} starts university`);
      kidsCosts += childYearlyCost(kidCurrentAge) * inflationMultiplier;
    }

    const monthlyLivingTotal = inputs.livingExpenses.reduce(
      (sum, e) => sum + e.monthlyAmount, 0
    );
    const livingExpenses = monthlyLivingTotal * 12 * inflationMultiplier;

    // Tech upgrades
    let techExpenses = 0;
    if (inputs.techUpgradeCycle > 0 && y > 0 && y % inputs.techUpgradeCycle === 0) {
      techExpenses = inputs.techUpgradeCost * inflationMultiplier;
    }
    const hobbyCosts = totalHobbyCost * inflationMultiplier;

    // Travel — adjusted for kids
    const activeKids = countActiveKids(inputs, y);
    const kidsMultiplier = 1 + activeKids * inputs.travelKidsMultiplier;
    const travelCosts =
      inputs.tripsPerYear * inputs.avgCostPerTrip * kidsMultiplier * inflationMultiplier;

    // Other (big purchases + businesses)
    let otherExpenses = bigPurchaseAnnual * inflationMultiplier;
    if (y === 2 && totalBusinessCost > 0) {
      otherExpenses += totalBusinessCost;
      milestones.push("💼 Started business!");
    }

    otherExpenses += techExpenses;

    const totalExpenses =
      housing + carExpenses + kidsCosts + livingExpenses +
      hobbyCosts + travelCosts + otherExpenses;
    const totalIncome = salary + investmentIncome;

    // Only invest from salary while working; after retirement, withdraw to cover expenses
    const investmentAmount = isRetired ? 0 : salary * (inputs.investmentPercentage / 100);
    if (isRetired) {
      // Withdraw shortfall from portfolio
      const shortfall = totalExpenses - totalIncome;
      if (shortfall > 0) portfolioValue -= shortfall;
    } else {
      portfolioValue += investmentAmount;
    }
    // Apply returns only on positive portfolio (can't earn returns on debt)
    if (portfolioValue > 0) {
      portfolioValue *= 1 + inputs.expectedReturn / 100;
    }

    // Net worth = portfolio + home equity (tracks actual equity built up)
    let homeEquity = 0;
    if (houseBoughtYear >= 0) {
      const yearsOwned = y - houseBoughtYear;
      if (yearsOwned >= inputs.mortgageTerm) {
        homeEquity = homePrice;
      } else {
        // Down payment + approximate principal paid (simplified linear)
        const principalPaid = (loanAmount / inputs.mortgageTerm) * yearsOwned;
        homeEquity = downPayment + principalPaid;
      }
    }

    // Family gifts (every X years while parents alive, until age 65)
    if (inputs.familyGiftAmount > 0 && inputs.familyGiftInterval > 0 && age < inheritanceAge) {
      if (y > 0 && y % inputs.familyGiftInterval === 0) {
        portfolioValue += inputs.familyGiftAmount;
        milestones.push("🎁 Family gift received");
      }
    }

    // Inheritance lump sum
    if (inputs.expectedInheritance > 0 && age === inheritanceAge) {
      portfolioValue += inputs.expectedInheritance;
      milestones.push("💰 Received inheritance");
    }

    totalLifetimeCost += totalExpenses;

    // Dream life achievable: bought house + car + income covers expenses (no business requirement)
    const hasCorePurchases = houseBoughtYear >= 0 && y > 0;
    const canAfford = totalIncome >= totalExpenses;
    if (dreamLifeAchievableAge === null && canAfford && hasCorePurchases) {
      dreamLifeAchievableAge = age;
      milestones.push("⭐ Dream life achievable!");
    }

    // Dream entrepreneurial life: same + businesses started
    const businessesStarted = totalBusinessCost === 0 || y >= 2;
    if (dreamEntrepreneurialAge === null && canAfford && hasCorePurchases && businessesStarted && totalBusinessCost > 0) {
      dreamEntrepreneurialAge = age;
      milestones.push("🚀 Entrepreneurial dream achieved!");
    }

    if (isMiniRetirement && miniRetFraction >= 0.5) {
      milestones.push(`🌴 Mini-retirement (${inputs.miniRetirementDuration}mo)`);
    }

    if (age === inputs.targetRetireAge) {
      milestones.push("🎯 Retirement — no salary!");
    }

    snapshots.push({
      year: y + 1,
      age,
      salary: Math.round(salary),
      investmentIncome: Math.round(investmentIncome),
      totalIncome: Math.round(totalIncome),
      taxes: Math.round(taxes),
      pensionContribution: Math.round(pensionContribution),
      housing: Math.round(housing),
      carExpenses: Math.round(carExpenses),
      kidsCosts: Math.round(kidsCosts),
      livingExpenses: Math.round(livingExpenses),
      hobbyCosts: Math.round(hobbyCosts),
      travelCosts: Math.round(travelCosts),
      otherExpenses: Math.round(otherExpenses),
      totalExpenses: Math.round(totalExpenses),
      amountInvested: Math.round(investmentAmount),
      portfolioValue: Math.round(portfolioValue),
      netWorth: Math.round(portfolioValue + homeEquity),
      isWorking,
      isMiniRetirement,
      milestones,
    });
  }

  // Use last 5 years before retirement for annual cost calculation
  const preRetirementSnapshots = snapshots.filter(s => s.age < inputs.targetRetireAge);
  const last5 = preRetirementSnapshots.slice(-5);
  const dreamLifeAnnualCost = Math.round(
    last5.reduce((s, y) => s + y.totalExpenses, 0) / Math.max(last5.length, 1)
  );

  const goalAmount = dreamLifeAnnualCost * 25;
  const goalSnapshot = snapshots.find((s) => s.netWorth >= goalAmount);
  const yearsToGoal = goalSnapshot ? goalSnapshot.year : totalYears;
  const goalReachedAge = goalSnapshot
    ? goalSnapshot.age
    : inputs.targetRetireAge;

  // Total assets (purchases only — not recurring costs)
  const totalCarPurchases = snapshots.reduce((s, y) => {
    let purchases = 0;
    const yr = y.year - 1;
    if (yr === 0) purchases = carPrice;
    if (yr > 0 && yr % 15 === 0) purchases = carPrice * Math.pow(1 + inputs.inflationRate / 100, yr);
    return s + purchases;
  }, 0);
  const totalAssetsCost =
    homePrice +
    (inputs.holidayHome?.estimatedPrice ?? 0) +
    Math.round(totalCarPurchases) +
    totalBigPurchases +
    totalBusinessCost;

  const totalKidsCost = snapshots.reduce((s, y) => s + y.kidsCosts, 0);

  return {
    yearlySnapshots: snapshots,
    totalLifetimeCost: Math.round(totalLifetimeCost),
    yearsToGoal,
    goalReachedAge,
    dreamLifeAnnualCost,
    dreamLifeAchievableAge,
    dreamEntrepreneurialAge,
    totalAssetsCost: Math.round(totalAssetsCost),
    totalKidsCost: Math.round(totalKidsCost),
  };
}
