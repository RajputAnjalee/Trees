import React from 'react';
import { TreePine } from 'lucide-react';

export default function ProgressCircle({ percentage, treesPlanted }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#d1d5db"
          strokeWidth="8"
          fill="transparent"
          className="neumorphic-inset"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <TreePine className="w-6 h-6 text-green-600 mb-1" />
        <span className="text-xl font-bold text-gray-800">{treesPlanted}</span>
        <span className="text-xs text-gray-600">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}