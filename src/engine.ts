import type { DreamInputs, YearlySnapshot, SimulationResult } from "./types";

// Average cost per child per year (in EUR, base year)
// Ages 0-5: ~8000, 6-12: ~10000, 13-17: ~12000, 18-21: ~15000 (includes university)
function childYearlyCost(childAge: number): number {
  if (childAge < 0) return 0;
  if (childAge <= 5) return 8000;
  if (childAge <= 12) return 10000;
  if (childAge <= 17) return 12000;
  if (childAge <= 21) return 15000;
  return 0; // after 21, no longer dependent
}

function getMiniRetirementYears(
  inputs: DreamInputs,
  workingYears: number
): Set<number> {
  const years = new Set<number>();
  if (inputs.miniRetirements <= 0) return years;

  const spacing = Math.max(inputs.miniRetirementSpacing, 2);
  for (let i = 0; i < inputs.miniRetirements; i++) {
    const yearOffset = spacing * (i + 1);
    if (yearOffset < workingYears) {
      // Each mini-retirement is represented as a full year (covers 6 months off)
      years.add(yearOffset);
    }
  }
  return years;
}

export function runSimulation(inputs: DreamInputs): SimulationResult {
  const totalYears = Math.max(inputs.targetRetireAge - inputs.currentAge, 1);
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

  // Holiday home mortgage (if applicable)
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

  // Car cost — assume purchase in year 1
  const carPrice = inputs.dreamCar.estimatedPrice ?? 25000;

  // Business startup cost
  const businessCost = inputs.startBusiness?.estimatedPrice ?? 0;

  // Hobby annual costs
  const totalHobbyCost = inputs.hobbies.reduce(
    (sum, h) => sum + (h.estimatedPrice ?? 0),
    0
  );

  // Big purchases — spread evenly over first 10 years
  const totalBigPurchases = inputs.bigPurchases.reduce(
    (sum, p) => sum + (p.estimatedPrice ?? 0),
    0
  );
  const bigPurchaseAnnual =
    totalBigPurchases / Math.min(10, totalYears);

  // Mini-retirements
  const miniRetYears = getMiniRetirementYears(inputs, totalYears);

  // Determine when we buy the house (when we have enough for down payment)
  let houseBoughtYear = -1;
  let holidayHomeBoughtYear = -1;
  let portfolioValue = inputs.currentSavings;
  let totalLifetimeCost = 0;

  for (let y = 0; y < totalYears; y++) {
    const age = inputs.currentAge + y;
    const inflationMultiplier = Math.pow(1 + inputs.inflationRate / 100, y);
    const isMiniRetirement = miniRetYears.has(y);
    const isWorking = !isMiniRetirement;

    // Income
    const salaryGrowthMultiplier = Math.pow(
      1 + inputs.salaryGrowthRate / 100,
      y
    );
    const salary = isWorking
      ? inputs.annualSalary * salaryGrowthMultiplier
      : inputs.annualSalary * salaryGrowthMultiplier * 0.5; // half salary during mini-retirement (savings buffer)

    const investmentIncome = portfolioValue * (inputs.expectedReturn / 100);

    // Housing
    let housing = 0;
    const milestones: string[] = [];

    if (houseBoughtYear < 0) {
      // Still renting — check if we can buy
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
      // Mortgage paid off
      if (y - houseBoughtYear === inputs.mortgageTerm) {
        milestones.push("🎉 Mortgage paid off!");
      }
      housing = 2000 * inflationMultiplier; // maintenance/taxes only
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

    // Car
    let carExpenses = inputs.annualCarCosts * inflationMultiplier;
    if (y === 0) {
      carExpenses += carPrice;
      milestones.push("🚗 Bought dream car!");
    }
    // Replace car every 8 years
    if (y > 0 && y % 8 === 0) {
      carExpenses += carPrice * inflationMultiplier;
      milestones.push("🚗 Replaced car");
    }

    // Kids
    let kidsCosts = 0;
    for (let k = 0; k < inputs.numberOfKids; k++) {
      const kidStartAge = inputs.kidsAges[k] ?? -2 * (k + 1);
      const kidCurrentAge = kidStartAge + y;
      if (kidCurrentAge === 0) {
        milestones.push(`👶 Child ${k + 1} born!`);
      }
      if (kidCurrentAge === 18) {
        milestones.push(`🎓 Child ${k + 1} starts university`);
      }
      kidsCosts += childYearlyCost(kidCurrentAge) * inflationMultiplier;
    }

    // Living expenses
    const livingExpenses =
      inputs.monthlyLivingExpenses * 12 * inflationMultiplier;

    // Hobbies
    const hobbyCosts = totalHobbyCost * inflationMultiplier;

    // Other (big purchases + business)
    let otherExpenses = bigPurchaseAnnual * inflationMultiplier;
    if (y === 2 && businessCost > 0) {
      otherExpenses += businessCost;
      milestones.push("💼 Started business!");
    }

    const totalExpenses =
      housing +
      carExpenses +
      kidsCosts +
      livingExpenses +
      hobbyCosts +
      otherExpenses;
    const totalIncome = salary + investmentIncome;

    // Update portfolio
    const investmentAmount = isWorking
      ? salary * (inputs.investmentPercentage / 100)
      : 0;
    portfolioValue += investmentAmount;
    portfolioValue *= 1 + inputs.expectedReturn / 100;

    // Net worth = portfolio + home equity
    let homeEquity = 0;
    if (houseBoughtYear >= 0) {
      const yearsOfPayment = y - houseBoughtYear;
      const paidFraction = Math.min(yearsOfPayment / inputs.mortgageTerm, 1);
      homeEquity = homePrice * paidFraction + downPayment * (1 - paidFraction);
    }

    totalLifetimeCost += totalExpenses;

    if (isMiniRetirement) {
      milestones.push("🌴 Mini-retirement!");
    }

    if (age === inputs.targetRetireAge - 1) {
      milestones.push("🎯 Target retirement age!");
    }

    snapshots.push({
      year: y + 1,
      age,
      salary: Math.round(salary),
      investmentIncome: Math.round(investmentIncome),
      totalIncome: Math.round(totalIncome),
      housing: Math.round(housing),
      carExpenses: Math.round(carExpenses),
      kidsCosts: Math.round(kidsCosts),
      livingExpenses: Math.round(livingExpenses),
      hobbyCosts: Math.round(hobbyCosts),
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

  // Calculate dream life annual cost (average of last 5 years expenses, excluding big one-offs)
  const last5 = snapshots.slice(-5);
  const dreamLifeAnnualCost = Math.round(
    last5.reduce((s, y) => s + y.totalExpenses, 0) / last5.length
  );

  // Years to goal = when net worth >= 25x annual expenses (4% rule)
  const goalAmount = dreamLifeAnnualCost * 25;
  const goalSnapshot = snapshots.find((s) => s.netWorth >= goalAmount);
  const yearsToGoal = goalSnapshot ? goalSnapshot.year : totalYears;
  const goalReachedAge = goalSnapshot
    ? goalSnapshot.age
    : inputs.targetRetireAge;

  return {
    yearlySnapshots: snapshots,
    totalLifetimeCost: Math.round(totalLifetimeCost),
    yearsToGoal,
    goalReachedAge,
    dreamLifeAnnualCost,
  };
}
