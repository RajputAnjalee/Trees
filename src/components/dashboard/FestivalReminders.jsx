import React from 'react';
import { Calendar, Sparkles, Heart } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FESTIVALS_2024 = [
  { name: 'Diwali', date: new Date(2024, 9, 31), emoji: '🪔', suggestion: 'Light up the world with trees!' },
  { name: 'Holi', date: new Date(2025, 2, 14), emoji: '🎨', suggestion: 'Add colors of green to nature!' },
  { name: 'Earth Day', date: new Date(2025, 3, 22), emoji: '🌍', suggestion: 'Perfect day to plant trees!' },
  { name: 'World Environment Day', date: new Date(2025, 5, 5), emoji: '🌱', suggestion: 'Celebrate with tree planting!' },
  { name: 'Ganesh Chaturthi', date: new Date(2025, 7, 27), emoji: '🐘', suggestion: 'Seek blessings through planting!' },
  { name: 'Christmas', date: new Date(2024, 11, 25), emoji: '🎄', suggestion: 'Give the gift of green!' },
  { name: 'New Year', date: new Date(2025, 0, 1), emoji: '🎊', suggestion: 'Start the year green!' }
];

export default function FestivalReminders() {
  const getUpcomingFestivals = () => {
    const today = new Date();
    return FESTIVALS_2024
      .map(festival => ({
        ...festival,
        daysUntil: differenceInDays(festival.date, today)
      }))
      .filter(festival => festival.daysUntil >= 0 && festival.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3);
  };

  const upcomingFestivals = getUpcomingFestivals();

  if (upcomingFestivals.length === 0) {
    return null;
  }

  return (
    <div className="neumorphic p-6 rounded-3xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-800">Festival Opportunities</h3>
      </div>
      
      <div className="space-y-3">
        {upcomingFestivals.map((festival, index) => (
          <div key={index} className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{festival.emoji}</div>
                <div>
                  <p className="font-semibold text-gray-800">{festival.name}</p>
                  <p className="text-sm text-gray-600">
                    {festival.daysUntil === 0 ? 'Today!' : 
                     festival.daysUntil === 1 ? 'Tomorrow' : 
                     `In ${festival.daysUntil} days`}
                  </p>
                </div>
              </div>
              
              <Link 
                to={createPageUrl("Purchase")}
                className="neumorphic-small px-3 py-2 rounded-xl text-green-700 font-medium text-sm hover:shadow-lg transition-all duration-200"
              >
                Plant Trees
              </Link>
            </div>
            
            <div className="mt-3 neumorphic-inset p-3 rounded-xl bg-blue-50 bg-opacity-50">
              <p className="text-xs text-gray-700">
                💡 {festival.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}