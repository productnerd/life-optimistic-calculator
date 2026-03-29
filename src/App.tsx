import { useState, useMemo, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { InputSections } from "@/components/InputSections";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { createDefaultInputs } from "@/types";
import type { DreamInputs } from "@/types";
import { runSimulation } from "@/engine";
import { estimatePrice } from "@/ai";
import { Calculator, Heart } from "lucide-react";

function App() {
  const [inputs, setInputs] = useState<DreamInputs>(createDefaultInputs);
  const [apiKey, setApiKey] = useState<string | null>(() =>
    localStorage.getItem("claude-api-key")
  );

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
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-background to-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Life Optimistic Calculator
              </h1>
              <p className="text-xs text-muted-foreground">
                Your dream life costs less than you think
              </p>
            </div>
          </div>
          <ApiKeyDialog apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          How much does your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            {" "}
            dream life{" "}
          </span>
          actually cost?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Most people overestimate what they need. Configure your ideal
          lifestyle below and discover that financial freedom might be closer
          than you think.
        </p>
      </section>

      <Separator />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Left: Inputs */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Design Your Dream Life
            </h3>
            <InputSections
              inputs={inputs}
              onChange={setInputs}
              onEstimate={handleEstimate}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Financial Journey
            </h3>
            <ResultsDashboard result={result} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> to
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
