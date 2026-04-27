"use client";
import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

type MortDict = { title: string; down: string; term: string; years: string; rate: string; monthly: string };

export function MortgageCalculator({ price, dict }: { price: number; dict?: MortDict }) {
  const t: MortDict = dict ?? {
    title: "Mortgage Calculator",
    down: "Down Payment",
    term: "Loan Term",
    years: "years",
    rate: "Interest Rate",
    monthly: "Estimated monthly payment",
  };
  const [down, setDown] = useState(Math.round(price * 0.2));
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.5);

  const monthly = useMemo(() => {
    const principal = price - down;
    const r = rate / 100 / 12;
    const n = years * 12;
    if (principal <= 0 || r === 0) return 0;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }, [price, down, years, rate]);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-brand-600" />
        <h3 className="font-semibold text-lg">{t.title}</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t.down}</span>
            <span className="font-semibold">€{down.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={price}
            step={1000}
            value={down}
            onChange={(e) => setDown(+e.target.value)}
            className="w-full accent-brand-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t.term}</span>
            <span className="font-semibold">{years} {t.years}</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full accent-brand-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{t.rate}</span>
            <span className="font-semibold">{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-brand-600"
          />
        </div>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-brand-50 via-brand-100/50 to-accent-50 dark:from-brand-900/30 dark:via-brand-800/20 dark:to-accent-900/10 p-4 text-center">
        <p className="text-xs text-ink-500 mb-1">{t.monthly}</p>
        <p className="font-display text-3xl font-bold gradient-text">
          €{Math.round(monthly).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
