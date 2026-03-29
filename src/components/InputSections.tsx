import {
  Card,
  CardContent,
  CardDescription,
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
  ShoppingBag,
} from "lucide-react";
import type { DreamInputs, AIPricedItem } from "@/types";

interface InputSectionsProps {
  inputs: DreamInputs;
  onChange: (inputs: DreamInputs) => void;
  onEstimate: (description: string, category: string) => Promise<number>;
}

export function InputSections({
  inputs,
  onChange,
  onEstimate,
}: InputSectionsProps) {
  const update = (partial: Partial<DreamInputs>) =>
    onChange({ ...inputs, ...partial });

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
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            You & Your Income
          </CardTitle>
          <CardDescription>
            Tell us about yourself and how much you earn
          </CardDescription>
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
              label="Target Retirement Age"
              value={inputs.targetRetireAge}
              onChange={(v) => update({ targetRetireAge: v })}
              min={30}
              max={80}
            />
          </div>
          <NumberField
            label="Current Savings"
            value={inputs.currentSavings}
            onChange={(v) => update({ currentSavings: v })}
            min={0}
            prefix="€"
          />
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
        </CardContent>
      </Card>

      {/* Investment */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Strategy
          </CardTitle>
          <CardDescription>
            How you grow your wealth over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="% of Income Invested"
            value={inputs.investmentPercentage}
            onChange={(v) => update({ investmentPercentage: v })}
            min={0}
            max={70}
            step={1}
            unit="%"
          />
          <SliderField
            label="Expected Annual Return"
            value={inputs.expectedReturn}
            onChange={(v) => update({ expectedReturn: v })}
            min={1}
            max={15}
            step={0.5}
            unit="%"
            description="S&P 500 historical average is ~7% after inflation"
          />
          <SliderField
            label="Inflation Rate"
            value={inputs.inflationRate}
            onChange={(v) => update({ inflationRate: v })}
            min={0}
            max={8}
            step={0.5}
            unit="%"
          />
        </CardContent>
      </Card>

      {/* Housing */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5 text-primary" />
            Dream Home
          </CardTitle>
          <CardDescription>
            Describe your dream home — AI will estimate the price
          </CardDescription>
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
          <AIField
            label="Holiday / Second Home"
            placeholder='e.g. "Small cottage in the countryside near Porto"'
            item={
              inputs.holidayHome ?? {
                description: "",
                estimatedPrice: null,
                isLoading: false,
              }
            }
            onChange={(item) =>
              updateAIItem(
                "holidayHome",
                item.description ? item : (null as unknown as AIPricedItem)
              )
            }
            onEstimate={(desc) => onEstimate(desc, "holiday property")}
            optional
          />
        </CardContent>
      </Card>

      {/* Car */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-primary" />
            Dream Car
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
        </CardContent>
      </Card>

      {/* Family */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Baby className="h-5 w-5 text-primary" />
            Family
          </CardTitle>
          <CardDescription>
            Kids cost ~€8-15K/year each (including university) up to age 21
          </CardDescription>
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

      {/* Lifestyle */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Lifestyle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Monthly Living Expenses"
            value={inputs.monthlyLivingExpenses}
            onChange={(v) => update({ monthlyLivingExpenses: v })}
            min={500}
            max={10000}
            step={100}
            prefix="€"
            description="Food, utilities, entertainment, subscriptions, etc."
          />
          <Separator />
          <AIField
            label="Start a Business?"
            placeholder='e.g. "Small coffee shop" or "Online SaaS startup"'
            item={
              inputs.startBusiness ?? {
                description: "",
                estimatedPrice: null,
                isLoading: false,
              }
            }
            onChange={(item) =>
              updateAIItem(
                "startBusiness",
                item.description ? item : (null as unknown as AIPricedItem)
              )
            }
            onEstimate={(desc) => onEstimate(desc, "business startup cost")}
            optional
          />
        </CardContent>
      </Card>

      {/* Mini-retirements */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palmtree className="h-5 w-5 text-primary" />
            Mini-Retirements
          </CardTitle>
          <CardDescription>
            6-month breaks from work to recharge, travel, or explore
          </CardDescription>
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
            <SliderField
              label="Years Between Breaks"
              value={inputs.miniRetirementSpacing}
              onChange={(v) => update({ miniRetirementSpacing: v })}
              min={2}
              max={15}
              step={1}
              unit=" yrs"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
