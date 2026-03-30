import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AIField } from "./AIField";
import { SliderField } from "./SliderField";
import { NumberField } from "./NumberField";
import {
  Home,
  Car,
  Baby,
  Wallet,
  TrendingUp,
  Palmtree,
  Plane,
  ShoppingBag,
  Briefcase,
  Link,
} from "lucide-react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import type { DreamInputs, AIPricedItem } from "@/types";
import { createAIPricedItem } from "@/types";
import { estimateTaxes } from "@/ai";

interface InputSectionsProps {
  inputs: DreamInputs;
  onChange: (inputs: DreamInputs) => void;
  onEstimate: (description: string, category: string) => Promise<number>;
  apiKey: string | null;
}

function CountryTaxField({ inputs, update, apiKey }: { inputs: DreamInputs; update: (partial: Partial<DreamInputs>) => void; apiKey: string | null }) {
  const [countryInput, setCountryInput] = useState(inputs.country);
  const [isLoading, setIsLoading] = useState(false);
  const [estimated, setEstimated] = useState(!!inputs.country);

  const handleEstimate = async () => {
    if (!countryInput.trim()) return;
    setIsLoading(true);
    try {
      const result = await estimateTaxes(countryInput, inputs.annualSalary, apiKey);
      update({
        country: countryInput,
        effectiveTaxRate: result.effectiveTaxRate,
        pensionContributionPercent: result.pensionContributionPercent,
      });
      setEstimated(true);
    } catch {
      update({ country: countryInput });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-medium">Country</p>
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder='e.g. "Netherlands", "USA", "Portugal"'
          value={countryInput}
          onChange={(e) => {
            setCountryInput(e.target.value);
            setEstimated(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleEstimate();
            }
          }}
          onBlur={handleEstimate}
          className="pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!isLoading && estimated && countryInput && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {estimated && countryInput && (
        <p className="text-xs text-muted-foreground mt-1.5">
          Based on €{inputs.annualSalary.toLocaleString()} salary in {countryInput}: <span className="text-foreground font-medium">{inputs.effectiveTaxRate}% tax</span>, <span className="text-foreground font-medium">{inputs.pensionContributionPercent}% pension</span>
        </p>
      )}
    </div>
  );
}

export function InputSections({
  inputs,
  onChange,
  onEstimate,
  apiKey,
}: InputSectionsProps) {
  const update = (partial: Partial<DreamInputs>) =>
    onChange({ ...inputs, ...partial });

  const businessesRef = useRef<HTMLDivElement>(null);
  const housingRef = useRef<HTMLDivElement>(null);

  // Build linkable assets list
  const linkableAssets: { value: string; label: string }[] = [];
  if (inputs.dreamHome.description || inputs.dreamHome.estimatedPrice) {
    linkableAssets.push({ value: "dreamHome", label: "Dream Home" });
  }
  inputs.additionalProperties.forEach((p, i) => {
    if (p.estimatedPrice) {
      linkableAssets.push({ value: `property-${i}`, label: p.description || `Property ${i + 1}` });
    }
  });
  inputs.businesses.forEach((b, i) => {
    linkableAssets.push({ value: `business-${i}`, label: b.description || `Business ${i + 1}` });
  });
  const hasLinkableAssets = linkableAssets.length > 0;

  const updateAIItem = (
    key: keyof DreamInputs,
    item: AIPricedItem
  ) => {
    onChange({ ...inputs, [key]: item });
  };

  return (
    <div className="space-y-6">
      {/* Personal & Income */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Wallet className="h-5 w-5 text-primary" />
            You & Your Income
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Current Age"
              value={inputs.currentAge}
              onChange={(v) => update({ currentAge: v })}
              min={18}
              max={65}
            />
            <NumberField
              label="Retirement (no salary) Age"
              value={inputs.targetRetireAge}
              onChange={(v) => update({ targetRetireAge: v })}
              min={30}
              max={80}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Cash in the Bank"
              value={inputs.currentSavings}
              onChange={(v) => update({ currentSavings: v })}
              min={0}
              prefix="€"
              description="Liquid savings — used for purchases"
            />
            <NumberField
              label="Invested Money"
              value={inputs.currentInvestments}
              onChange={(v) => update({ currentInvestments: v })}
              min={0}
              prefix="€"
              description="Stocks, funds, crypto — never touched for purchases"
            />
          </div>
          <NumberField
            label="Expected Inheritance"
            value={inputs.expectedInheritance}
            onChange={(v) => update({ expectedInheritance: v })}
            min={0}
            prefix="€"
            description="Lump sum at age 65 (parents 25 at your birth, live to 90)"
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Family Gift Amount"
              value={inputs.familyGiftAmount}
              onChange={(v) => update({ familyGiftAmount: v })}
              min={0}
              prefix="€"
              description="Gift received periodically"
            />
            <NumberField
              label="Every X Years"
              value={inputs.familyGiftInterval}
              onChange={(v) => update({ familyGiftInterval: v })}
              min={1}
              max={20}
              suffix=" yrs"
              description="How often gifts arrive"
            />
          </div>
          <Separator />
          <SliderField
            label="Annual Salary"
            value={inputs.annualSalary}
            onChange={(v) => update({ annualSalary: v })}
            min={15000}
            max={300000}
            step={1000}
            prefix="€"
          />
          <SliderField
            label="Annual Salary Growth"
            value={inputs.salaryGrowthRate}
            onChange={(v) => update({ salaryGrowthRate: v })}
            min={0}
            max={10}
            step={0.5}
            unit="%"
            description="Expected yearly raise"
          />
          <Separator />
          {/* Country & Tax */}
          <CountryTaxField inputs={inputs} update={update} apiKey={apiKey} />
          <div className="grid grid-cols-2 gap-4">
            <SliderField
              label="Effective Tax Rate"
              value={inputs.effectiveTaxRate}
              onChange={(v) => update({ effectiveTaxRate: v })}
              min={0}
              max={55}
              step={1}
              unit="%"
              description="Adjust based on your bracket"
            />
            <SliderField
              label="Pension Contribution"
              value={inputs.pensionContributionPercent}
              onChange={(v) => update({ pensionContributionPercent: v })}
              min={0}
              max={20}
              step={0.5}
              unit="%"
              description="% of gross salary"
            />
          </div>
          <Separator />
          {/* Partner Salary */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Partner Salary</p>
              <p className="text-xs text-muted-foreground">
                Add a second income from your partner
              </p>
            </div>
            <Button
              size="sm"
              variant={inputs.partnerSalary !== null ? "default" : "outline"}
              onClick={() =>
                update({
                  partnerSalary: inputs.partnerSalary !== null ? null : 40000,
                })
              }
            >
              {inputs.partnerSalary !== null ? "On" : "Off"}
            </Button>
          </div>
          {inputs.partnerSalary !== null && (
            <>
              <SliderField
                label="Partner Annual Salary"
                value={inputs.partnerSalary}
                onChange={(v) => update({ partnerSalary: v })}
                min={0}
                max={300000}
                step={1000}
                prefix="€"
              />
              <SliderField
                label="Partner Salary Growth"
                value={inputs.partnerSalaryGrowth}
                onChange={(v) => update({ partnerSalaryGrowth: v })}
                min={0}
                max={10}
                step={0.5}
                unit="%"
              />
            </>
          )}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Additional Income</p>
                <p className="text-xs text-muted-foreground">
                  Side projects, freelancing, rental income, etc.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    additionalIncome: [
                      ...inputs.additionalIncome,
                      { name: "", monthlyAmount: 0, annualGrowthRate: 3, startsInYears: 0, linkedTo: null },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {inputs.additionalIncome.map((stream, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. Freelancing"
                    value={stream.name}
                    onChange={(e) => {
                      const updated = [...inputs.additionalIncome];
                      updated[i] = { ...updated[i], name: e.target.value };
                      update({ additionalIncome: updated });
                    }}
                    className="flex-1"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      €
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={stream.monthlyAmount || ""}
                      onChange={(e) => {
                        const updated = [...inputs.additionalIncome];
                        updated[i] = {
                          ...updated[i],
                          monthlyAmount: Number(e.target.value),
                        };
                        update({ additionalIncome: updated });
                      }}
                      className="pl-8"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    /mo
                  </span>
                  <div className="relative w-20">
                    <Input
                      type="number"
                      placeholder="3"
                      value={stream.annualGrowthRate || ""}
                      onChange={(e) => {
                        const updated = [...inputs.additionalIncome];
                        updated[i] = {
                          ...updated[i],
                          annualGrowthRate: Number(e.target.value),
                        };
                        update({ additionalIncome: updated });
                      }}
                      className="pr-6"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      %/yr
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const updated = inputs.additionalIncome.filter(
                        (_, idx) => idx !== i
                      );
                      update({ additionalIncome: updated });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Linked asset or manual start year */}
                <div className="flex items-center gap-2 pl-1">
                  <Link className="h-3 w-3 text-muted-foreground shrink-0" />
                  {hasLinkableAssets ? (
                    <select
                      className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground appearance-none cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-ring transition-colors"
                      value={stream.linkedTo ?? ""}
                      onChange={(e) => {
                        const updated = [...inputs.additionalIncome];
                        const val = e.target.value || null;
                        updated[i] = { ...updated[i], linkedTo: val };
                        update({ additionalIncome: updated });
                      }}
                    >
                      <option value="">Manual start (in {stream.startsInYears || 0} yrs)</option>
                      {linkableAssets.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground flex-1">No properties or businesses yet</span>
                  )}
                  {!stream.linkedTo && (
                    <div className="relative w-20">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">in</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={stream.startsInYears || ""}
                        onChange={(e) => {
                          const updated = [...inputs.additionalIncome];
                          updated[i] = { ...updated[i], startsInYears: Number(e.target.value) };
                          update({ additionalIncome: updated });
                        }}
                        className="pl-6 pr-6 h-7 text-xs"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">yr</span>
                    </div>
                  )}
                  {!hasLinkableAssets && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2"
                        onClick={() => {
                          housingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                      >
                        + Property
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs px-2"
                        onClick={() => {
                          // Create a business and scroll to it
                          update({
                            businesses: [
                              ...inputs.businesses,
                              createAIPricedItem(),
                            ],
                          });
                          setTimeout(() => businessesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
                        }}
                      >
                        + Business
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {inputs.additionalIncome.length > 0 && (
              <p className="text-sm font-medium text-primary text-right">
                Total additional: €
                {inputs.additionalIncome
                  .reduce((s, i) => s + i.monthlyAmount, 0)
                  .toLocaleString()}
                /mo (€
                {(inputs.additionalIncome
                  .reduce((s, i) => s + i.monthlyAmount, 0) * 12)
                  .toLocaleString()}
                /yr)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {(() => {
            const totalIncome =
              inputs.annualSalary +
              (inputs.partnerSalary ?? 0) +
              inputs.additionalIncome.reduce((s, i) => s + i.monthlyAmount * 12, 0);
            const monthlyLiving = inputs.livingExpenses.reduce(
              (s, e) => s + e.monthlyAmount, 0
            );
            const annualExpenses =
              inputs.monthlyRent * 12 +
              monthlyLiving * 12 +
              inputs.annualCarCosts +
              inputs.tripsPerYear * inputs.avgCostPerTrip;
            const maxInvestPct =
              totalIncome > 0
                ? Math.max(0, Math.floor(((totalIncome - annualExpenses) / totalIncome) * 100))
                : 0;
            const cappedMax = Math.min(maxInvestPct, 90);
            const effectiveValue = Math.min(inputs.investmentPercentage, cappedMax);
            if (effectiveValue !== inputs.investmentPercentage) {
              // Auto-adjust if current value exceeds cap
              requestAnimationFrame(() => update({ investmentPercentage: effectiveValue }));
            }
            return (
              <>
                <SliderField
                  label="% of Income Invested"
                  value={effectiveValue}
                  onChange={(v) => update({ investmentPercentage: v })}
                  min={0}
                  max={cappedMax}
                  step={1}
                  unit="%"
                  description={`Max ${cappedMax}% based on your expenses`}
                />
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Investment Allocation</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        update({
                          investmentAllocations: [
                            ...inputs.investmentAllocations,
                            { name: "", percentage: 0, expectedReturn: 5 },
                          ],
                        });
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    How your invested {effectiveValue}% is split across asset classes
                  </p>
                  <div className="space-y-2">
                    {inputs.investmentAllocations.map((alloc, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="e.g. Stocks"
                          value={alloc.name}
                          onChange={(e) => {
                            const updated = [...inputs.investmentAllocations];
                            updated[i] = { ...updated[i], name: e.target.value };
                            update({ investmentAllocations: updated });
                          }}
                          className="flex-1"
                        />
                        <div className="relative w-20">
                          <Input
                            type="number"
                            placeholder="0"
                            value={alloc.percentage || ""}
                            onChange={(e) => {
                              const updated = [...inputs.investmentAllocations];
                              updated[i] = { ...updated[i], percentage: Number(e.target.value) };
                              update({ investmentAllocations: updated });
                            }}
                            className="pr-6"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                        </div>
                        <div className="relative w-20">
                          <Input
                            type="number"
                            placeholder="7"
                            value={alloc.expectedReturn || ""}
                            onChange={(e) => {
                              const updated = [...inputs.investmentAllocations];
                              updated[i] = { ...updated[i], expectedReturn: Number(e.target.value) };
                              update({ investmentAllocations: updated });
                            }}
                            className="pr-10"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%/yr</span>
                        </div>
                        {inputs.investmentAllocations.length > 1 && (
                          <button
                            onClick={() => {
                              update({
                                investmentAllocations: inputs.investmentAllocations.filter((_, j) => j !== i),
                              });
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const totalPct = inputs.investmentAllocations.reduce((s, a) => s + a.percentage, 0);
                    const blended = totalPct > 0
                      ? inputs.investmentAllocations.reduce((s, a) => s + (a.percentage / totalPct) * a.expectedReturn, 0)
                      : 0;
                    return (
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span className={totalPct !== 100 ? "text-amber-500 font-medium" : ""}>
                          Total: {totalPct}%{totalPct !== 100 ? " (should be 100%)" : ""}
                        </span>
                        <span>Blended return: <span className="text-foreground font-medium">{blended.toFixed(1)}%/yr</span></span>
                      </div>
                    );
                  })()}
                </div>
                <Separator />
                <SliderField
                  label="Inflation Rate"
                  value={inputs.inflationRate}
                  onChange={(v) => update({ inflationRate: v })}
                  min={0}
                  max={8}
                  step={0.5}
                  unit="%"
                />
              </>
            );
          })()}
        </CardContent>
      </Card>

      {/* Housing */}
      <Card ref={housingRef}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Home className="h-5 w-5 text-primary" />
            Dream Home
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <AIField
            label="Dream Home"
            placeholder='e.g. "3-bed house with garden in Lisbon suburbs"'
            item={inputs.dreamHome}
            onChange={(item) => updateAIItem("dreamHome", item)}
            onEstimate={(desc) => onEstimate(desc, "residential property")}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Monthly Rent (until you buy)"
              value={inputs.monthlyRent}
              onChange={(v) => update({ monthlyRent: v })}
              min={0}
              prefix="€"
            />
            <NumberField
              label="Down Payment"
              value={inputs.downPaymentPercent}
              onChange={(v) => update({ downPaymentPercent: v })}
              min={5}
              max={100}
              suffix="%"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SliderField
              label="Mortgage Rate"
              value={inputs.mortgageRate}
              onChange={(v) => update({ mortgageRate: v })}
              min={1}
              max={10}
              step={0.25}
              unit="%"
            />
            <SliderField
              label="Mortgage Term"
              value={inputs.mortgageTerm}
              onChange={(v) => update({ mortgageTerm: v })}
              min={10}
              max={40}
              step={5}
              unit=" yrs"
            />
          </div>
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Additional Real Estate</p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  update({
                    additionalProperties: [
                      ...inputs.additionalProperties,
                      createAIPricedItem(),
                    ],
                  });
                }}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Property
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Holiday homes, rental properties, land, etc.
            </p>
            {inputs.additionalProperties.map((prop, i) => (
              <div key={prop.id} className="mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <AIField
                      label=""
                      placeholder='e.g. "Cottage near Porto" or "Studio apartment in Berlin"'
                      item={prop}
                      onChange={(item) => {
                        const updated = [...inputs.additionalProperties];
                        updated[i] = item;
                        update({ additionalProperties: updated });
                      }}
                      onEstimate={(desc) => onEstimate(desc, "residential property")}
                    />
                  </div>
                  <button
                    onClick={() => {
                      update({
                        additionalProperties: inputs.additionalProperties.filter((_, j) => j !== i),
                      });
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors mt-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Monthly Living Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inputs.livingExpenses.map((expense, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={expense.name}
                onChange={(e) => {
                  const updated = [...inputs.livingExpenses];
                  updated[i] = { ...updated[i], name: e.target.value };
                  update({ livingExpenses: updated });
                }}
                className="flex-1"
              />
              <div className="relative w-28">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  type="number"
                  value={expense.monthlyAmount || ""}
                  onChange={(e) => {
                    const updated = [...inputs.livingExpenses];
                    updated[i] = {
                      ...updated[i],
                      monthlyAmount: Number(e.target.value),
                    };
                    update({ livingExpenses: updated });
                  }}
                  className="pl-8"
                />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                /mo
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  const updated = inputs.livingExpenses.filter(
                    (_, idx) => idx !== i
                  );
                  update({ livingExpenses: updated });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              update({
                livingExpenses: [
                  ...inputs.livingExpenses,
                  { name: "", monthlyAmount: 0 },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="Tech Upgrade Cycle"
              value={inputs.techUpgradeCycle}
              onChange={(v) => update({ techUpgradeCycle: v })}
              min={1}
              max={10}
              suffix=" yrs"
              description="Replace laptop & phone every X years"
            />
            <NumberField
              label="Upgrade Cost"
              value={inputs.techUpgradeCost}
              onChange={(v) => update({ techUpgradeCost: v })}
              min={0}
              prefix="€"
              description="Laptop + smartphone total"
            />
          </div>
        </CardContent>
      </Card>

      {/* Travel */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Plane className="h-5 w-5 text-primary" />
            Travel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Trips Per Year"
            value={inputs.tripsPerYear}
            onChange={(v) => update({ tripsPerYear: v })}
            min={0}
            max={12}
            step={1}
          />
          {inputs.tripsPerYear > 0 && (
            <>
              <SliderField
                label="Average Cost Per Trip"
                value={inputs.avgCostPerTrip}
                onChange={(v) => update({ avgCostPerTrip: v })}
                min={200}
                max={10000}
                step={100}
                prefix="€"
                description={`Total: €${(inputs.tripsPerYear * inputs.avgCostPerTrip).toLocaleString()}/year`}
              />
              {inputs.numberOfKids > 0 && (
                <SliderField
                  label="Extra Cost Per Kid (multiplier)"
                  value={inputs.travelKidsMultiplier}
                  onChange={(v) => update({ travelKidsMultiplier: v })}
                  min={0}
                  max={1}
                  step={0.1}
                  unit="x"
                  description={`Each kid adds ${Math.round(inputs.travelKidsMultiplier * 100)}% to trip cost`}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Businesses */}
      <Card ref={businessesRef}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Briefcase className="h-5 w-5 text-primary" />
            Businesses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Your Businesses</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    businesses: [
                      ...inputs.businesses,
                      createAIPricedItem(),
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {inputs.businesses.map((biz, i) => (
              <div key={biz.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <AIField
                    label=""
                    placeholder='e.g. "Small coffee shop" or "Online SaaS startup"'
                    item={biz}
                    onChange={(item) => {
                      const updated = [...inputs.businesses];
                      updated[i] = item;
                      update({ businesses: updated });
                    }}
                    onEstimate={(desc) => onEstimate(desc, "business startup cost")}
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive mt-2"
                  onClick={() => {
                    const updated = inputs.businesses.filter(
                      (_, idx) => idx !== i
                    );
                    update({ businesses: updated });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {inputs.businesses.length > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Total startup costs: €
                {inputs.businesses
                  .reduce((s, b) => s + (b.estimatedPrice ?? 0), 0)
                  .toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Car & Big Purchases */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Car className="h-5 w-5 text-primary" />
            Car & Big Purchases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <AIField
            label="Dream Car"
            placeholder='e.g. "Porsche 911 from 2004" or "Tesla Model 3 2024"'
            item={inputs.dreamCar}
            onChange={(item) => updateAIItem("dreamCar", item)}
            onEstimate={(desc) => onEstimate(desc, "car")}
          />
          <NumberField
            label="Annual Running Costs"
            value={inputs.annualCarCosts}
            onChange={(v) => update({ annualCarCosts: v })}
            min={0}
            prefix="€"
            description="Insurance, fuel, maintenance, etc."
          />
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Other Big Purchases</p>
                <p className="text-xs text-muted-foreground">
                  Boat, watch, piano, etc. — AI estimates the price
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    bigPurchases: [
                      ...inputs.bigPurchases,
                      createAIPricedItem(),
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {inputs.bigPurchases.map((purchase, i) => (
              <div key={purchase.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <AIField
                    label=""
                    placeholder='e.g. "Rolex Submariner" or "Grand piano"'
                    item={purchase}
                    onChange={(item) => {
                      const updated = [...inputs.bigPurchases];
                      updated[i] = item;
                      update({ bigPurchases: updated });
                    }}
                    onEstimate={(desc) => onEstimate(desc, "luxury item")}
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive mt-2"
                  onClick={() => {
                    const updated = inputs.bigPurchases.filter(
                      (_, idx) => idx !== i
                    );
                    update({ bigPurchases: updated });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {inputs.bigPurchases.length > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Total: €
                {inputs.bigPurchases
                  .reduce((s, p) => s + (p.estimatedPrice ?? 0), 0)
                  .toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Family */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Baby className="h-5 w-5 text-primary" />
            Family
          </CardTitle>
          <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
            <p><span className="font-medium">Age 0–5:</span> ~€8K/yr — childcare, diapers, baby gear, food</p>
            <p><span className="font-medium">Age 6–12:</span> ~€10K/yr — school supplies, activities, clothing, food</p>
            <p><span className="font-medium">Age 13–17:</span> ~€12K/yr — hobbies, tech, social activities, food</p>
            <p><span className="font-medium">Age 18–21:</span> ~€15K/yr — university tuition, housing, living costs</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Number of Kids"
            value={inputs.numberOfKids}
            onChange={(v) => {
              const ages = Array.from({ length: v }, (_, i) =>
                inputs.kidsAges[i] ?? -(2 + i * 2)
              );
              update({ numberOfKids: v, kidsAges: ages });
            }}
            min={0}
            max={5}
            step={1}
          />
          {inputs.kidsAges.map((age, i) => (
            <NumberField
              key={i}
              label={`Child ${i + 1} — ${age >= 0 ? `currently ${age} years old` : `planned in ${Math.abs(age)} years`}`}
              value={age}
              onChange={(v) => {
                const newAges = [...inputs.kidsAges];
                newAges[i] = v;
                update({ kidsAges: newAges });
              }}
              min={-20}
              max={21}
              description="Negative = years until born, Positive = current age"
            />
          ))}
        </CardContent>
      </Card>

      {/* Mini-retirements */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Palmtree className="h-5 w-5 text-primary" />
            Mini-Retirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Number of Mini-Retirements"
            value={inputs.miniRetirements}
            onChange={(v) => update({ miniRetirements: v })}
            min={0}
            max={5}
            step={1}
          />
          {inputs.miniRetirements > 0 && (
            <>
              <SliderField
                label="Duration of Each Break"
                value={inputs.miniRetirementDuration}
                onChange={(v) => update({ miniRetirementDuration: v })}
                min={1}
                max={60}
                step={1}
                unit=" months"
                description={`Total time off: ${inputs.miniRetirements * inputs.miniRetirementDuration} months (spaced evenly)`}
              />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Stop side income too</p>
                  <p className="text-xs text-muted-foreground">All additional income streams pause during breaks</p>
                </div>
                <Button
                  size="sm"
                  variant={inputs.miniRetirementStopSideIncome ? "default" : "outline"}
                  onClick={() => update({ miniRetirementStopSideIncome: !inputs.miniRetirementStopSideIncome })}
                >
                  {inputs.miniRetirementStopSideIncome ? "Yes" : "No"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
