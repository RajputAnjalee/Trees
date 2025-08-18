import React from 'react';
import { Calendar, Gift, Cake, Heart } from 'lucide-react';
import { format, differenceInDays, addYears } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BirthdayReminders({ user }) {
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const birthdays = [];

    // User's birthday
    if (user?.date_of_birth) {
      const birthDate = new Date(user.date_of_birth);
      const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      const nextBirthday = thisYearBirthday < today ? 
        addYears(thisYearBirthday, 1) : thisYearBirthday;
      
      const age = nextBirthday.getFullYear() - birthDate.getFullYear();
      const daysUntil = differenceInDays(nextBirthday, today);
      
      if (daysUntil <= 30) {
        birthdays.push({
          name: 'You',
          date: nextBirthday,
          age,
          daysUntil,
          isUser: true
        });
      }
    }

    // Family members' birthdays
    if (user?.family_members) {
      user.family_members.forEach(member => {
        if (member.date_of_birth) {
          const birthDate = new Date(member.date_of_birth);
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
          const nextBirthday = thisYearBirthday < today ? 
            addYears(thisYearBirthday, 1) : thisYearBirthday;
          
          const age = nextBirthday.getFullYear() - birthDate.getFullYear();
          const daysUntil = differenceInDays(nextBirthday, today);
          
          if (daysUntil <= 30) {
            birthdays.push({
              name: member.name,
              date: nextBirthday,
              age,
              daysUntil,
              relationship: member.relationship,
              isUser: false
            });
          }
        }
      });
    }

    return birthdays.sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  if (upcomingBirthdays.length === 0) {
    return null;
  }

  return (
    <div className="neumorphic p-6 rounded-3xl">
      <div className="flex items-center gap-2 mb-4">
        <Cake className="w-5 h-5 text-pink-600" />
        <h3 className="text-xl font-bold text-gray-800">Upcoming Birthdays</h3>
      </div>
      
      <div className="space-y-3">
        {upcomingBirthdays.map((birthday, index) => (
          <div key={index} className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="neumorphic-small p-2 rounded-xl">
                  {birthday.isUser ? (
                    <Heart className="w-4 h-4 text-red-500" />
                  ) : (
                    <Gift className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {birthday.name} turns {birthday.age}
                  </p>
                  <p className="text-sm text-gray-600">
                    {birthday.daysUntil === 0 ? 'Today!' : 
                     birthday.daysUntil === 1 ? 'Tomorrow' : 
                     `In ${birthday.daysUntil} days`}
                    {!birthday.isUser && birthday.relationship && 
                      ` • ${birthday.relationship}`}
                  </p>
                </div>
              </div>
              
              <Link 
                to={createPageUrl("Purchase")}
                className="neumorphic-small px-3 py-2 rounded-xl text-green-700 font-medium text-sm hover:shadow-lg transition-all duration-200"
              >
                Plant {birthday.age} Trees
              </Link>
            </div>
            
            <div className="mt-3 neumorphic-inset p-3 rounded-xl bg-yellow-50 bg-opacity-50">
              <p className="text-xs text-gray-700">
                💡 Suggestion: Plant {birthday.age} saplings to celebrate this special day!
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}