import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Label as RechartsLabel,
} from "recharts";
import { Calendar, Coins, Star, ShoppingBag, Info, ChevronDown } from "lucide-react";
import type { SimulationResult, DreamInputs } from "@/types";

interface ResultsDashboardProps {
  result: SimulationResult;
  inputs: DreamInputs;
}

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
  return `€${n.toLocaleString()}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const milestones: string[] = payload[0]?.payload?.milestones ?? [];
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-sm">
      <p className="font-semibold mb-1">Age {label}</p>
      {payload.map((entry: any) => (
        entry.name !== "milestones" && (
          <div key={entry.name} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="font-mono">{formatCurrency(entry.value)}</span>
          </div>
        )
      ))}
      {milestones.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/50 space-y-0.5">
          {milestones.map((m, i) => (
            <p key={i} className="text-xs text-primary">{m}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export function ResultsDashboard({ result, inputs }: ResultsDashboardProps) {
  const { yearlySnapshots, totalLifetimeCost, dreamLifeAnnualCost, dreamLifeAchievableAge, dreamEntrepreneurialAge, totalAssetsCost, totalKidsCost } = result;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const toggleCard = (id: string) => setExpandedCard(prev => prev === id ? null : id);

  // Prepare chart data
  const incomeExpenseData = yearlySnapshots.map((s) => ({
    age: s.age,
    "Net Salary": s.salary,
    "Side Income": s.sideIncome,
    "Partner Income": s.partnerIncome,
    "Investment Income": s.investmentIncome,
    Taxes: -s.taxes,
    Pension: -s.pensionContribution,
    Housing: -s.housing,
    Car: -s.carExpenses,
    Kids: -s.kidsCosts,
    Living: -s.livingExpenses,
    Travel: -s.travelCosts,
    Other: -(s.hobbyCosts + s.otherExpenses),
  }));

  const netWorthData = yearlySnapshots.map((s) => ({
    age: s.age,
    "Net Worth": s.netWorth,
    "Portfolio": s.portfolioValue,
    milestones: s.milestones.filter(m => !m.includes("Mini-retirement")),
  }));

  // Collect all milestones
  const milestones = yearlySnapshots.flatMap((s) =>
    s.milestones.map((m) => ({ age: s.age, label: m, netWorth: s.netWorth }))
  );

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card stat-card col-span-2 border-primary/20" onClick={() => toggleCard("dream")}>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-primary">
                <Star className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Dream Life Achievable At
                </span>
                <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                  <Info className="h-3.5 w-3.5 text-primary/60" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                    The earliest age when you've bought your home & car and your income covers all your expenses.
                  </span>
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-primary/40 transition-transform duration-300 ${expandedCard === "dream" ? "rotate-180" : ""}`} />
            </div>
            <p className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>
              {dreamLifeAchievableAge ?? "—"}
            </p>
            <p className="text-sm text-primary/80 mt-1" >
              {dreamLifeAchievableAge
                ? `In ${dreamLifeAchievableAge - yearlySnapshots[0].age} years — you can live your dream!`
                : "Not yet reachable with current settings — try adjusting inputs"}
            </p>
            {expandedCard === "dream" && dreamLifeAchievableAge && (() => {
              const snap = yearlySnapshots.find(s => s.age === dreamLifeAchievableAge);
              if (!snap) return null;
              // Collect all milestones achieved up to dream life age
              const achieved = yearlySnapshots
                .filter(s => s.age <= dreamLifeAchievableAge)
                .flatMap(s => s.milestones.filter(m =>
                  m.includes("Bought") || m.includes("Started") || m.includes("born") || m.includes("Mortgage paid")
                ));
              // Deduplicate
              const uniqueAchieved = [...new Set(achieved)];
              return (
                <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                  <p className="text-primary/70 font-medium mb-2">By age {dreamLifeAchievableAge}, you'll have:</p>
                  {uniqueAchieved.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-500 shrink-0">✓</span>
                      <span className="text-foreground">{m.replace(/^[^\w]*/, '')}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 shrink-0">✓</span>
                    <span className="text-foreground">Income covers all expenses</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
                    <div className="flex justify-between"><span>Net salary</span><span className="font-mono text-foreground">{formatCurrency(snap.salary)}</span></div>
                    <div className="flex justify-between"><span>Investment income</span><span className="font-mono text-foreground">{formatCurrency(snap.investmentIncome)}</span></div>
                    <div className="flex justify-between font-medium text-primary/80 pt-1 border-t border-border/30"><span>Total income</span><span className="font-mono">{formatCurrency(snap.totalIncome)}</span></div>
                    <div className="flex justify-between"><span>Total expenses</span><span className="font-mono text-foreground">{formatCurrency(snap.totalExpenses)}</span></div>
                    <div className="flex justify-between"><span>Net worth</span><span className="font-mono text-foreground">{formatCurrency(snap.netWorth)}</span></div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {dreamEntrepreneurialAge !== null && (
          <Card className="glass-card stat-card col-span-2 border-primary/15" onClick={() => toggleCard("entrepreneur")}>
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-primary/90">
                  <span className="text-sm">🚀</span>
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Entrepreneurial Dream At
                  </span>
                  <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                    <Info className="h-3.5 w-3.5 text-primary/50" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                      The earliest age when you've bought your home, started your businesses, and your income covers all expenses.
                    </span>
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-primary/30 transition-transform duration-300 ${expandedCard === "entrepreneur" ? "rotate-180" : ""}`} />
              </div>
              <p className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>
                {dreamEntrepreneurialAge}
              </p>
              <p className="text-sm text-primary/70 mt-1" >
                In {dreamEntrepreneurialAge - yearlySnapshots[0].age} years — including your businesses!
              </p>
              {expandedCard === "entrepreneur" && (() => {
                const snap = yearlySnapshots.find(s => s.age === dreamEntrepreneurialAge);
                if (!snap) return null;
                const totalBusinessCost = inputs.businesses.reduce((s, b) => s + (b.estimatedPrice ?? 0), 0);
                return (
                  <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
                    <p className="text-primary/70 font-medium mb-2">At age {dreamEntrepreneurialAge}:</p>
                    <div className="flex justify-between"><span>Total income</span><span className="font-mono text-foreground">{formatCurrency(snap.totalIncome)}</span></div>
                    <div className="flex justify-between"><span>Total expenses</span><span className="font-mono text-foreground">{formatCurrency(snap.totalExpenses)}</span></div>
                    <div className="flex justify-between"><span>Business investment</span><span className="font-mono text-foreground">{formatCurrency(totalBusinessCost)}</span></div>
                    <div className="flex justify-between"><span>Net worth</span><span className="font-mono text-foreground">{formatCurrency(snap.netWorth)}</span></div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        <Card className="glass-card stat-card" onClick={() => toggleCard("annual")}>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Annual Costs
                </span>
                <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                    Average yearly expenses over the last 5 years of the simulation.
                  </span>
                </span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/30 transition-transform duration-300 ${expandedCard === "annual" ? "rotate-180" : ""}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(dreamLifeAnnualCost)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">per year</p>
            {expandedCard === "annual" && (() => {
              const last5 = yearlySnapshots.slice(-5);
              const avg = (fn: (s: typeof last5[0]) => number) => Math.round(last5.reduce((s, y) => s + fn(y), 0) / last5.length);
              return (
                <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
                  <p className="text-muted-foreground/70 font-medium mb-2">Avg. over last 5 years:</p>
                  <div className="flex justify-between"><span>Housing</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.housing))}</span></div>
                  <div className="flex justify-between"><span>Living expenses</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.livingExpenses))}</span></div>
                  <div className="flex justify-between"><span>Kids</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.kidsCosts))}</span></div>
                  <div className="flex justify-between"><span>Car</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.carExpenses))}</span></div>
                  <div className="flex justify-between"><span>Travel</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.travelCosts))}</span></div>
                  <div className="flex justify-between"><span>Hobbies & other</span><span className="font-mono text-foreground">{formatCurrency(avg(s => s.hobbyCosts + s.otherExpenses))}</span></div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <Card className="glass-card stat-card" onClick={() => toggleCard("assets")}>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Assets & Purchases
                </span>
                <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                    Total cost of home, holiday home, car purchases, businesses, and big purchases.
                  </span>
                </span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/30 transition-transform duration-300 ${expandedCard === "assets" ? "rotate-180" : ""}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(totalAssetsCost)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">homes, cars, businesses</p>
            {expandedCard === "assets" && (() => {
              const homePrice = inputs.dreamHome.estimatedPrice ?? 300000;
              const additionalPropsTotal = inputs.additionalProperties.reduce((s, p) => s + (p.estimatedPrice ?? 0), 0);
              const totalBusinessCost = inputs.businesses.reduce((s, b) => s + (b.estimatedPrice ?? 0), 0);
              const totalBigPurchases = inputs.bigPurchases.reduce((s, p) => s + (p.estimatedPrice ?? 0), 0);
              const carCosts = totalAssetsCost - homePrice - additionalPropsTotal - totalBusinessCost - totalBigPurchases;
              return (
                <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Dream home</span><span className="font-mono text-foreground">{formatCurrency(homePrice)}</span></div>
                  {inputs.additionalProperties.map((p, i) => (
                    p.estimatedPrice ? <div key={i} className="flex justify-between"><span>{p.description || `Property ${i + 1}`}</span><span className="font-mono text-foreground">{formatCurrency(p.estimatedPrice)}</span></div> : null
                  ))}
                  <div className="flex justify-between"><span>Cars (incl. replacements)</span><span className="font-mono text-foreground">{formatCurrency(Math.max(0, carCosts))}</span></div>
                  {totalBusinessCost > 0 && <div className="flex justify-between"><span>Businesses</span><span className="font-mono text-foreground">{formatCurrency(totalBusinessCost)}</span></div>}
                  {totalBigPurchases > 0 && <div className="flex justify-between"><span>Big purchases</span><span className="font-mono text-foreground">{formatCurrency(totalBigPurchases)}</span></div>}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {totalKidsCost > 0 && (
          <Card className="glass-card stat-card" onClick={() => toggleCard("kids")}>
            <CardContent>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">👶</span>
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Kids Cost
                  </span>
                  <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                      Total child-rearing costs from birth to age 21.
                    </span>
                  </span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/30 transition-transform duration-300 ${expandedCard === "kids" ? "rotate-180" : ""}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(totalKidsCost)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">birth to age 21</p>
              {expandedCard === "kids" && (
                <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
                  <p className="text-muted-foreground/70 font-medium mb-2">{inputs.numberOfKids} child{inputs.numberOfKids !== 1 ? "ren" : ""}, cost per year by age:</p>
                  <div className="flex justify-between"><span>0–5 yrs (childcare)</span><span className="font-mono text-foreground">€8,000/yr</span></div>
                  <div className="flex justify-between"><span>6–12 yrs (school age)</span><span className="font-mono text-foreground">€10,000/yr</span></div>
                  <div className="flex justify-between"><span>13–17 yrs (teen)</span><span className="font-mono text-foreground">€12,000/yr</span></div>
                  <div className="flex justify-between"><span>18–21 yrs (university)</span><span className="font-mono text-foreground">€15,000/yr</span></div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="glass-card stat-card" onClick={() => toggleCard("lifetime")}>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Lifetime Cost
                </span>
                <span className="group relative cursor-help" onClick={(e) => e.stopPropagation()}>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-popover text-popover-foreground text-xs p-2.5 hidden group-hover:block z-50 border border-border shadow-lg">
                    Sum of all expenses from now until retirement.
                  </span>
                </span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/30 transition-transform duration-300 ${expandedCard === "lifetime" ? "rotate-180" : ""}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(totalLifetimeCost)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">until retirement</p>
            {expandedCard === "lifetime" && (() => {
              const totals = yearlySnapshots.reduce((acc, s) => ({
                housing: acc.housing + s.housing,
                living: acc.living + s.livingExpenses,
                kids: acc.kids + s.kidsCosts,
                car: acc.car + s.carExpenses,
                travel: acc.travel + s.travelCosts,
                other: acc.other + s.hobbyCosts + s.otherExpenses,
              }), { housing: 0, living: 0, kids: 0, car: 0, travel: 0, other: 0 });
              return (
                <div className="card-breakdown mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
                  <p className="text-muted-foreground/70 font-medium mb-2">Over {yearlySnapshots.length} years:</p>
                  <div className="flex justify-between"><span>Housing</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.housing))}</span></div>
                  <div className="flex justify-between"><span>Living expenses</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.living))}</span></div>
                  {totals.kids > 0 && <div className="flex justify-between"><span>Kids</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.kids))}</span></div>}
                  <div className="flex justify-between"><span>Car</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.car))}</span></div>
                  <div className="flex justify-between"><span>Travel</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.travel))}</span></div>
                  <div className="flex justify-between"><span>Hobbies & other</span><span className="font-mono text-foreground">{formatCurrency(Math.round(totals.other))}</span></div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg" style={{ fontFamily: "'Fraunces', serif" }}>Net Worth Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={netWorthData} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: 0 }}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 16 }} />
                {dreamLifeAchievableAge && (
                  <ReferenceLine
                    x={dreamLifeAchievableAge}
                    stroke="#C4A882"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    label={{
                      value: `⭐ Dream life at ${dreamLifeAchievableAge}`,
                      position: "top",
                      fill: "#D4C5A9",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                )}
                {milestones
                  .filter((m) =>
                    m.label.includes("Bought") || m.label.includes("Started business") || m.label.includes("born")
                  )
                  .map((m, i) => {
                    const color = m.label.includes("Dream life") || m.label.includes("Entrepreneurial")
                      ? "#C4A882"
                      : m.label.includes("home") || m.label.includes("property") || m.label.includes("Mortgage")
                      ? "#A69076"
                      : m.label.includes("car") || m.label.includes("Car")
                      ? "#78716c"
                      : m.label.includes("business") || m.label.includes("Business")
                      ? "#e59500"
                      : m.label.includes("gift") || m.label.includes("inheritance") || m.label.includes("Inheritance")
                      ? "#10b981"
                      : m.label.includes("Retirement")
                      ? "#ef4444"
                      : "#A69076";
                    return (
                      <ReferenceDot
                        key={i}
                        x={m.age}
                        y={m.netWorth}
                        r={7}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                        shape={(props: any) => (
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={7}
                            fill={color}
                            stroke="#fff"
                            strokeWidth={2}
                            style={{ cursor: "pointer", pointerEvents: "none" }}
                          />
                        )}
                      />
                    );
                  })}
                <Line
                  type="monotone"
                  dataKey="Net Worth"
                  stroke="#A69076"
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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
            Income vs Expenses (Year by Year)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeExpenseData} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: 0 }}
                />
                <YAxis tickFormatter={formatCurrency} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 16 }} />
                <ReferenceLine y={0} stroke="#78716c" />
                {/* Income (positive) */}
                <Area
                  type="monotone"
                  dataKey="Net Salary"
                  stackId="income"
                  fill="#8B9E6B"
                  stroke="#8B9E6B"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Side Income"
                  stackId="income"
                  fill="#e59500"
                  stroke="#e59500"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Partner Income"
                  stackId="income"
                  fill="#10b981"
                  stroke="#10b981"
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
                  dataKey="Taxes"
                  stackId="expenses"
                  fill="#9333ea"
                  stroke="#9333ea"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Pension"
                  stackId="expenses"
                  fill="#6366f1"
                  stroke="#6366f1"
                  fillOpacity={0.4}
                />
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
                  fill="#A69076"
                  stroke="#A69076"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Travel"
                  stackId="expenses"
                  fill="#06b6d4"
                  stroke="#06b6d4"
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

      {/* Milestones Timeline Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg" style={{ fontFamily: "'Fraunces', serif" }}>Life Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={netWorthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={formatCurrency} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Net Worth"
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  dot={false}
                />
                {milestones.map((m, i) => {
                  const emoji = m.label.match(/^[^\s]+/)?.[0] ?? "·";
                  return (
                    <ReferenceDot
                      key={i}
                      x={m.age}
                      y={m.netWorth}
                      r={0}
                    >
                      <RechartsLabel
                        value={emoji}
                        position="top"
                        style={{ fontSize: 18 }}
                      />
                    </ReferenceDot>
                  );
                })}
                {dreamLifeAchievableAge && (
                  <ReferenceLine
                    x={dreamLifeAchievableAge}
                    stroke="#C4A882"
                    strokeDasharray="6 3"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {milestones.map((m, i) => (
              <span key={i}>
                <span className="font-medium text-foreground">Age {m.age}</span>{" "}
                {m.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
