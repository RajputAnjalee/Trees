import React from 'react';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral' // 'positive', 'negative', or 'neutral'
}) {
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-blue-600'
  };

  const iconColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-blue-600',
    default: 'text-gray-700'
  };

  // Determine icon color based on title if trendType is not provided
  const getIconColor = () => {
    if (trendType) return iconColors[trendType] || iconColors.default;
    return iconColors.default;
  };

  return (
    <div className="neumorphic p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="neumorphic-small p-3 rounded-xl">
          <Icon className={`w-6 h-6 ${getIconColor()}`} />
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {typeof value === 'number' && value >= 1000 
            ? `${(value / 1000).toFixed(1)}k` 
            : value}
        </p>
        {trend && (
          <p className={`${trendColors[trendType] || 'text-gray-600'} text-xs font-medium mt-2 flex items-center`}>
            {trendType === 'positive' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            )}
            {trendType === 'negative' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
            )}
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}