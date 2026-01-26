import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_MARKET_DATA } from '../constants';
import { MarketData } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMarketInsight } from '../services/geminiService';

const PriceWidget: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MarketData>(MOCK_MARKET_DATA[0]);
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const text = await getMarketInsight(selectedItem.item);
      setInsight(text);
      setLoading(false);
    };
    fetchInsight();
  }, [selectedItem]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const chartData = [
    { name: 'Low', price: selectedItem.low },
    { name: 'Avg', price: selectedItem.average },
    { name: 'High', price: selectedItem.high },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Market Rates</h3>
        <select 
          className="p-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none"
          value={selectedItem.item}
          onChange={(e) => {
            const item = MOCK_MARKET_DATA.find(d => d.item === e.target.value);
            if (item) setSelectedItem(item);
          }}
        >
          {MOCK_MARKET_DATA.map(d => (
            <option key={d.item} value={d.item}>{d.item}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-gray-500">Average</p>
          <p className="text-xl font-bold text-gray-900">₹{selectedItem.average}</p>
        </div>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500">Trend</p>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon(selectedItem.trend)}
            <span className="text-sm font-medium capitalize">{selectedItem.trend}</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: 'transparent'}}
            />
            <Bar dataKey="price" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 1 ? '#F97316' : '#CBD5E1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-600 italic bg-blue-50 p-3 rounded-lg border border-blue-100">
        <span className="font-semibold text-blue-800">AI Insight: </span>
        {loading ? "Analyzing market trends..." : insight}
      </div>
    </div>
  );
};

export default PriceWidget;
