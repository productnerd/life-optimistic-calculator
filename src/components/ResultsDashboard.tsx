import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { Target, TrendingUp, Calendar, Coins } from "lucide-react";
import type { SimulationResult } from "@/types";

interface ResultsDashboardProps {
  result: SimulationResult;
}

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
  return `€${n.toLocaleString()}`;
}

function getLifestyleTier(annualCost: number): {
  label: string;
  color: string;
  message: string;
} {
  if (annualCost < 25000)
    return {
      label: "Modest",
      color: "bg-green-100 text-green-800",
      message: "Very achievable! Most jobs can get you here.",
    };
  if (annualCost < 50000)
    return {
      label: "Comfortable",
      color: "bg-blue-100 text-blue-800",
      message: "A great life. Totally within reach with a solid career.",
    };
  if (annualCost < 100000)
    return {
      label: "Luxurious",
      color: "bg-purple-100 text-purple-800",
      message: "Living well — requires dedication but very doable.",
    };
  return {
    label: "Ultra-Luxury",
    color: "bg-amber-100 text-amber-800",
    message: "The top tier — each step up here costs exponentially more.",
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-sm">
      <p className="font-semibold mb-1">Age {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-mono">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { yearlySnapshots, totalLifetimeCost, yearsToGoal, goalReachedAge, dreamLifeAnnualCost } = result;
  const tier = getLifestyleTier(dreamLifeAnnualCost);
  const goalAmount = dreamLifeAnnualCost * 25;

  // Prepare chart data
  const incomeExpenseData = yearlySnapshots.map((s) => ({
    age: s.age,
    Salary: s.salary,
    "Investment Income": s.investmentIncome,
    Housing: -s.housing,
    Car: -s.carExpenses,
    Kids: -s.kidsCosts,
    Living: -s.livingExpenses,
    Other: -(s.hobbyCosts + s.otherExpenses),
  }));

  const netWorthData = yearlySnapshots.map((s) => ({
    age: s.age,
    "Net Worth": s.netWorth,
    "Portfolio": s.portfolioValue,
  }));

  // Collect all milestones
  const milestones = yearlySnapshots.flatMap((s) =>
    s.milestones.map((m) => ({ age: s.age, label: m, netWorth: s.netWorth }))
  );

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Financial Freedom At
              </span>
            </div>
            <p className="text-3xl font-bold text-green-800">
              {goalReachedAge}
            </p>
            <p className="text-xs text-green-600 mt-1">
              In {yearsToGoal} years
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Dream Life Costs
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-800">
              {formatCurrency(dreamLifeAnnualCost)}
            </p>
            <p className="text-xs text-blue-600 mt-1">per year</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Freedom Number
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-800">
              {formatCurrency(goalAmount)}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              25x annual expenses (4% rule)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Lifetime Cost
              </span>
            </div>
            <p className="text-3xl font-bold text-amber-800">
              {formatCurrency(totalLifetimeCost)}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              until retirement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lifestyle Tier */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Badge className={`${tier.color} text-sm px-3 py-1`}>
              {tier.label}
            </Badge>
            <p className="text-sm text-muted-foreground">{tier.message}</p>
          </div>
          {/* Tier scale */}
          <div className="mt-4 flex items-center gap-1">
            {["Modest", "Comfortable", "Luxurious", "Ultra-Luxury"].map(
              (t) => (
                <div
                  key={t}
                  className={`flex-1 h-2 rounded-full ${
                    t === tier.label
                      ? t === "Modest"
                        ? "bg-green-500"
                        : t === "Comfortable"
                          ? "bg-blue-500"
                          : t === "Luxurious"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                      : "bg-muted"
                  }`}
                />
              )
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Modest</span>
            <span>Comfortable</span>
            <span>Luxurious</span>
            <span>Ultra-Luxury</span>
          </div>
        </CardContent>
      </Card>

      {/* Net Worth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Net Worth Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={netWorthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: -5 }}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine
                  y={goalAmount}
                  stroke="#16a34a"
                  strokeDasharray="8 4"
                  label={{
                    value: `Freedom: ${formatCurrency(goalAmount)}`,
                    position: "right",
                    fill: "#16a34a",
                    fontSize: 12,
                  }}
                />
                {milestones
                  .filter((m) => m.label.includes("home") || m.label.includes("retirement") || m.label.includes("Freedom"))
                  .map((m, i) => (
                    <ReferenceDot
                      key={i}
                      x={m.age}
                      y={m.netWorth}
                      r={6}
                      fill="#f59e0b"
                      stroke="#fff"
                    />
                  ))}
                <Line
                  type="monotone"
                  dataKey="Net Worth"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Portfolio"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Income vs Expenses (Year by Year)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: -5 }}
                />
                <YAxis tickFormatter={formatCurrency} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine y={0} stroke="#78716c" />
                {/* Income (positive) */}
                <Area
                  type="monotone"
                  dataKey="Salary"
                  stackId="income"
                  fill="#16a34a"
                  stroke="#16a34a"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Investment Income"
                  stackId="income"
                  fill="#2563eb"
                  stroke="#2563eb"
                  fillOpacity={0.6}
                />
                {/* Expenses (negative) */}
                <Area
                  type="monotone"
                  dataKey="Housing"
                  stackId="expenses"
                  fill="#ef4444"
                  stroke="#ef4444"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Living"
                  stackId="expenses"
                  fill="#f97316"
                  stroke="#f97316"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Kids"
                  stackId="expenses"
                  fill="#eab308"
                  stroke="#eab308"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Car"
                  stackId="expenses"
                  fill="#8b5cf6"
                  stroke="#8b5cf6"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Other"
                  stackId="expenses"
                  fill="#ec4899"
                  stroke="#ec4899"
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Life Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <Badge variant="outline" className="tabular-nums shrink-0">
                  Age {m.age}
                </Badge>
                <span className="text-sm">{m.label}</span>
                <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                  Net worth: {formatCurrency(m.netWorth)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
