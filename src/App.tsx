import { useState, useMemo, useCallback } from "react";
import { InputSections } from "@/components/InputSections";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { createDefaultInputs } from "@/types";
import type { DreamInputs } from "@/types";
import { runSimulation } from "@/engine";
import { estimatePrice } from "@/ai";
import { Heart, Maximize2, Minimize2 } from "lucide-react";

function App() {
  const [inputs, setInputs] = useState<DreamInputs>(() => {
    try {
      const saved = localStorage.getItem("life-calc-inputs");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old data formats
        if (parsed.additionalIncome) {
          parsed.additionalIncome = parsed.additionalIncome.map(
            (s: any) => ({
              ...s,
              annualGrowthRate: s.annualGrowthRate ?? 3,
              linkedTo: s.linkedTo ?? null,
            })
          );
        }
        if (parsed.startBusiness && !parsed.businesses) {
          parsed.businesses = parsed.startBusiness
            ? [parsed.startBusiness]
            : [];
          delete parsed.startBusiness;
        }
        if (parsed.partnerSalary === undefined) {
          parsed.partnerSalary = null;
        }
        if (parsed.partnerSalaryGrowth === undefined) {
          parsed.partnerSalaryGrowth = 2;
        }
        if (parsed.travelKidsMultiplier === undefined) {
          parsed.travelKidsMultiplier = 0.5;
        }
        // Migrate monthlyLivingExpenses → livingExpenses
        if (parsed.monthlyLivingExpenses !== undefined && !parsed.livingExpenses) {
          const total = parsed.monthlyLivingExpenses;
          parsed.livingExpenses = [
            { name: "Food & Groceries", monthlyAmount: Math.round(total * 0.25) },
            { name: "Utilities & Bills", monthlyAmount: Math.round(total * 0.125) },
            { name: "Transport", monthlyAmount: Math.round(total * 0.1) },
            { name: "Software & Subscriptions", monthlyAmount: Math.round(total * 0.05) },
            { name: "Shopping & Clothing", monthlyAmount: Math.round(total * 0.1) },
            { name: "Health & Fitness", monthlyAmount: Math.round(total * 0.05) },
            { name: "Entertainment & Dining Out", monthlyAmount: Math.round(total * 0.15) },
            { name: "Insurance", monthlyAmount: Math.round(total * 0.1) },
            { name: "Personal Care", monthlyAmount: Math.round(total * 0.075) },
          ];
          delete parsed.monthlyLivingExpenses;
        }
        if (parsed.techUpgradeCycle === undefined) {
          parsed.techUpgradeCycle = 3;
        }
        if (parsed.techUpgradeCost === undefined) {
          parsed.techUpgradeCost = 2500;
        }
        if (parsed.expectedInheritance === undefined) {
          parsed.expectedInheritance = 0;
        }
        if (parsed.familyGiftAmount === undefined) {
          parsed.familyGiftAmount = 0;
        }
        if (parsed.familyGiftInterval === undefined) {
          parsed.familyGiftInterval = 10;
        }
        if (parsed.miniRetirementStopSideIncome === undefined) {
          parsed.miniRetirementStopSideIncome = false;
        }
        if (parsed.effectiveTaxRate === undefined) {
          parsed.effectiveTaxRate = 37;
        }
        if (parsed.pensionContributionPercent === undefined) {
          parsed.pensionContributionPercent = 5;
        }
        if (parsed.country === "Europe") {
          parsed.country = "Netherlands";
        }
        // Migrate expectedReturn → investmentAllocations
        if (parsed.expectedReturn !== undefined && !parsed.investmentAllocations) {
          parsed.investmentAllocations = [
            { name: "Stocks (Index Funds)", percentage: 100, expectedReturn: parsed.expectedReturn },
          ];
          delete parsed.expectedReturn;
        }
        // Migrate holidayHome → additionalProperties
        if (parsed.holidayHome !== undefined && !parsed.additionalProperties) {
          parsed.additionalProperties = parsed.holidayHome ? [parsed.holidayHome] : [];
          delete parsed.holidayHome;
        }
        // Ensure all AIPricedItems have an id
        const ensureId = (item: any) => {
          if (item && !item.id) item.id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          return item;
        };
        if (parsed.dreamHome) ensureId(parsed.dreamHome);
        if (parsed.dreamCar) ensureId(parsed.dreamCar);
        if (parsed.bigPurchases) parsed.bigPurchases = parsed.bigPurchases.map(ensureId);
        if (parsed.businesses) parsed.businesses = parsed.businesses.map(ensureId);
        if (parsed.hobbies) parsed.hobbies = parsed.hobbies.map(ensureId);
        if (parsed.additionalProperties) parsed.additionalProperties = parsed.additionalProperties.map(ensureId);
        return { ...createDefaultInputs(), ...parsed };
      }
    } catch {}
    return createDefaultInputs();
  });
  const [expanded, setExpanded] = useState(false);

  const updateInputs = useCallback((newInputs: DreamInputs) => {
    setInputs(newInputs);
    localStorage.setItem("life-calc-inputs", JSON.stringify(newInputs));
  }, []);

  const handleEstimate = useCallback(
    async (description: string, category: string): Promise<number> => {
      return estimatePrice(description, category, null);
    },
    []
  );

  const result = useMemo(() => runSimulation(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="w-full px-6 py-12 text-center">
        <h2
          className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Your{" "}
          <span className="text-primary">
            dream life
          </span>{" "}
          costs less than you think.
        </h2>
      </section>

      <div className="w-full px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className={`grid gap-8 transition-all duration-500 ${expanded ? "lg:grid-cols-[0fr_1fr]" : "lg:grid-cols-[1fr_1.2fr]"}`}>
          {/* Left: Inputs */}
          <div className={`transition-all duration-500 ${expanded ? "overflow-hidden opacity-0 max-w-0 min-w-0" : "opacity-100"}`}>
            <InputSections
              inputs={inputs}
              onChange={updateInputs}
              onEstimate={handleEstimate}
            />
          </div>

          {/* Right: Results */}
          <div className={`${expanded ? "" : "lg:sticky lg:top-24 lg:self-start"}`}>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-card border border-border/50 hover:border-border transition-all"
              >
                {expanded ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    Show Inputs
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    Expand Charts
                  </>
                )}
              </button>
            </div>
            <ResultsDashboard result={result} inputs={inputs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Made with <Heart className="h-4 w-4 text-primary fill-primary" /> to
          help people realize their dreams are closer than they think
        </p>
        <p className="mt-2 text-xs">
          This calculator provides estimates for educational purposes. Always
          consult a financial advisor for personalized advice.
        </p>
      </footer>
    </div>
  );
}

export default App;
