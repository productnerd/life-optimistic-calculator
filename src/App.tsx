import { useState, useMemo, useCallback } from "react";
import { InputSections } from "@/components/InputSections";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { createDefaultInputs } from "@/types";
import type { DreamInputs } from "@/types";
import { runSimulation } from "@/engine";
import { estimatePrice } from "@/ai";
import { Heart } from "lucide-react";

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
        return { ...createDefaultInputs(), ...parsed };
      }
    } catch {}
    return createDefaultInputs();
  });
  const [apiKey, setApiKey] = useState<string | null>(() =>
    localStorage.getItem("claude-api-key")
  );

  const updateInputs = useCallback((newInputs: DreamInputs) => {
    setInputs(newInputs);
    localStorage.setItem("life-calc-inputs", JSON.stringify(newInputs));
  }, []);

  const handleApiKeyChange = useCallback((key: string | null) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("claude-api-key", key);
    } else {
      localStorage.removeItem("claude-api-key");
    }
  }, []);

  const handleEstimate = useCallback(
    async (description: string, category: string): Promise<number> => {
      return estimatePrice(description, category, apiKey);
    },
    [apiKey]
  );

  const result = useMemo(() => runSimulation(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div />
          <ApiKeyDialog apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        </div>
      </header>

      {/* Hero */}
      <section className="w-full px-6 py-12 text-center">
        <h2
          className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          You don't need to slave around to get your{" "}
          <span className="text-primary">
            dream life
          </span>.
        </h2>
        <p
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto italic"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Your dream life costs less than you think.
        </p>
      </section>

      <div className="w-full px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Left: Inputs */}
          <div>
            <InputSections
              inputs={inputs}
              onChange={updateInputs}
              onEstimate={handleEstimate}
              apiKey={apiKey}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:sticky lg:top-24 lg:self-start">
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
