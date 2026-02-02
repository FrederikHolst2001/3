import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

/* ---------------- MOCK DATA GENERATOR ---------------- */

const generatePriceData = (basePrice, volatility, points, timeframe) => {
  let price = basePrice;
  const now = new Date();

  const minutesPerPoint = {
    '1M': 1,
    '5M': 5,
    '15M': 15,
    '1H': 60,
    '4H': 240,
    '1D': 1440
  };

  return Array.from({ length: points }, (_, i) => {
    price += (Math.random() - 0.48) * volatility;

    const time = new Date(
      now.getTime() - (points - 1 - i) * minutesPerPoint[timeframe] * 60000
    );

    return {
      time:
        timeframe === '1D'
          ? `${String(time.getDate()).padStart(2, '0')}/${String(
              time.getMonth() + 1
            ).padStart(2, '0')}`
          : `${String(time.getHours()).padStart(2, '0')}:${String(
              time.getMinutes()).padStart(2, '0')}`,
      price: Number(price.toFixed(5)),
      sma20: Number((price + Math.random() * volatility).toFixed(5)),
      sma50: Number((price + Math.random() * volatility).toFixed(5)),
    };
  });
};

/* ---------------- STATIC CONFIG ---------------- */

const pairs = [
  { code: 'EUR/USD', basePrice: 1.0847, volatility: 0.0015 },
  { code: 'GBP/USD', basePrice: 1.2634, volatility: 0.002 },
  { code: 'USD/JPY', basePrice: 154.32, volatility: 0.15 },
  { code: 'USD/CHF', basePrice: 0.8823, volatility: 0.0012 },
];

const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

const indicators = [
  { name: 'RSI (14)', value: '58.4', signal: 'neutral' },
  { name: 'MACD', value: '0.0012', signal: 'bullish' },
  { name: 'ADX', value: '32.1', signal: 'trending' },
];

const signalColors = {
  bullish: 'text-emerald-400 bg-emerald-500/20',
  bearish: 'text-rose-400 bg-rose-500/20',
  neutral: 'text-slate-400 bg-slate-500/20',
  trending: 'text-purple-400 bg-purple-500/20',
};

/* ---------------- COMPONENT ---------------- */

export default function TechnicalAnalysis() {
  const [selectedPair, setSelectedPair] = useState(pairs[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [chartData, setChartData] = useState([]);
  const [showSMA, setShowSMA] = useState(true);

  useEffect(() => {
    // 🚫 Live backend DISABLED — using mock data only
    setChartData(
      generatePriceData(
        selectedPair.basePrice,
        selectedPair.volatility,
        48,
        selectedTimeframe
      )
    );
  }, [selectedPair, selectedTimeframe]);

  const currentPrice =
    chartData.length > 0 ? chartData[chartData.length - 1].price : selectedPair.basePrice;
  const prevPrice =
    chartData.length > 0 ? chartData[0].price : selectedPair.basePrice;

  const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;
  const isUp = priceChange >= 0;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex justify-between flex-wrap gap-4">
        <Select
          value={selectedPair.code}
          onValueChange={(code) =>
            setSelectedPair(pairs.find(p => p.code === code))
          }
        >
          <SelectTrigger className="w-32 bg-slate-900 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {pairs.map(pair => (
              <SelectItem key={pair.code} value={pair.code}>
                {pair.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {timeframes.map(tf => (
            <Button
              key={tf}
              size="sm"
              variant="ghost"
              onClick={() => setSelectedTimeframe(tf)}
              className={selectedTimeframe === tf ? 'text-blue-400' : 'text-slate-400'}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip />
            {showSMA && (
              <>
                <Area dataKey="sma20" stroke="#3b82f6" fill="none" dot={false} />
                <Area dataKey="sma50" stroke="#a855f7" fill="none" dot={false} />
              </>
            )}
            <Area
              dataKey="price"
              stroke={isUp ? '#10b981' : '#f43f5e'}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Indicators */}
      <div className="p-4 grid grid-cols-3 gap-3 border-t border-slate-700/50">
        {indicators.map(ind => (
          <motion.div key={ind.name} className="bg-slate-900/50 p-3 rounded">
            <div className="text-xs text-slate-500">{ind.name}</div>
            <div className="text-lg text-white">{ind.value}</div>
            <Badge className={signalColors[ind.signal]}>{ind.signal}</Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
