import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface SquadCalculatorProps {
  currency: 'EUR' | 'USD' | 'GBP';
  onScrollToDirectory: () => void;
}

export const SquadCalculator: React.FC<SquadCalculatorProps> = ({
  currency,
  onScrollToDirectory,
}) => {
  const [seniors, setSeniors] = useState<number>(2);
  const [staffs, setStaffs] = useState<number>(1);
  const [principals, setPrincipals] = useState<number>(0);
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // Base daily rates in EUR
  const seniorRate = 780;
  const staffRate = 860;
  const principalRate = 1050;

  const totalDailyBurnEur = (seniors * seniorRate) + (staffs * staffRate) + (principals * principalRate);
  const workingDaysPerMonth = 21;
  const monthlyBurnEur = totalDailyBurnEur * workingDaysPerMonth;
  const totalContractCostEur = monthlyBurnEur * durationMonths;

  // Traditional agency fee calculation (25% on annual salary equivalent)
  const annualSalaryEquivEur = ((seniors * 125000) + (staffs * 142000) + (principals * 170000));
  const savedAgencyFeesEur = Math.round(annualSalaryEquivEur * 0.25);

  const formatCurrency = (eurAmount: number) => {
    if (currency === 'USD') return `$${Math.round(eurAmount * 1.08).toLocaleString()}`;
    if (currency === 'GBP') return `£${Math.round(eurAmount * 0.86).toLocaleString()}`;
    return `€${eurAmount.toLocaleString()}`;
  };

  const totalEngineers = seniors + staffs + principals;

  return (
    <section id="calculator" className="py-20 border-b border-neutral-200 bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 font-mono-numbers">
            <span>SQUAD ECONOMICS</span>
            <span aria-hidden="true">/</span>
            <span>SIMULATION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            Interactive Engineering Squad Model
          </h2>
          <p className="mt-4 text-base text-neutral-600">
            Simulate your engineering squad burn rate and calculate direct savings versus legacy recruitment headhunters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 border border-neutral-200 bg-white p-6 sm:p-8 rounded-sm space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-numbers mb-2">
                <span className="font-bold uppercase text-black">Senior Software Engineers</span>
                <span className="text-neutral-500">{seniors} Engineers ({formatCurrency(seniorRate)}/d)</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={seniors}
                onChange={(e) => setSeniors(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono-numbers mb-2">
                <span className="font-bold uppercase text-black">Staff / Lead Engineers</span>
                <span className="text-neutral-500">{staffs} Engineers ({formatCurrency(staffRate)}/d)</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={staffs}
                onChange={(e) => setStaffs(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono-numbers mb-2">
                <span className="font-bold uppercase text-black">Principal Systems Architects</span>
                <span className="text-neutral-500">{principals} Engineers ({formatCurrency(principalRate)}/d)</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={principals}
                onChange={(e) => setPrincipals(parseInt(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs font-mono-numbers mb-2">
                <span className="font-bold uppercase text-black">Project Sprint Horizon</span>
                <span className="text-neutral-500">{durationMonths} Months</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDurationMonths(m)}
                    className={`py-2 text-xs font-mono-numbers rounded border transition-colors cursor-pointer ${
                      durationMonths === m
                        ? 'border-black bg-black text-white font-bold'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {m} Mo
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-6 border border-black bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="text-xs uppercase font-mono-numbers tracking-wider text-neutral-400">
                Modeled Squad ({totalEngineers} Engineers)
              </span>
              <span className="text-xs font-mono-numbers text-emerald-400 font-semibold">
                Verified Direct Rates
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-neutral-400 font-mono-numbers uppercase">Blended Monthly Burn</div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1 font-mono-numbers">
                  {formatCurrency(monthlyBurnEur)}
                  <span className="text-xs font-normal text-neutral-400"> / month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs font-mono-numbers">
                <div>
                  <span className="text-neutral-400 block">Daily Squad Burn</span>
                  <span className="text-base font-bold text-white">{formatCurrency(totalDailyBurnEur)} / day</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">{durationMonths}-Month Runway Total</span>
                  <span className="text-base font-bold text-white">{formatCurrency(totalContractCostEur)}</span>
                </div>
              </div>

              {/* Headhunter Savings Highlight */}
              <div className="p-4 rounded bg-neutral-900 border border-neutral-700/80 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono-numbers">
                  <Check className="h-4 w-4" />
                  <span>{formatCurrency(savedAgencyFeesEur)} Estimated Headhunter Savings</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  By bypassing 25% contingent headhunter fees on a {totalEngineers}-person squad, your organization keeps capital in product velocity.
                </p>
              </div>
            </div>

            <button
              onClick={onScrollToDirectory}
              className="w-full py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Match Candidates to this Squad</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
