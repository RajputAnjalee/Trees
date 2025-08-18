import React from 'react';
import { format } from 'date-fns';
import { TreePine, Gift, MapPin } from 'lucide-react';

const OCCASION_ICONS = {
  Birthday: '🎂',
  Anniversary: '💍',
  'New Baby': '👶',
  'In Memory Of': '💐',
  Graduation: '🎓',
  'New Home': '🏠',
  Festival: '🎉',
  'General Contribution': '🌱'
};

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="neumorphic p-6 rounded-3xl">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="neumorphic-inset p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="neumorphic-small p-3 rounded-xl">
                  {activity.is_gift ? (
                    <Gift className="w-5 h-5 text-purple-600" />
                  ) : (
                    <TreePine className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {activity.quantity} saplings
                    </span>
                    <span className="text-2xl">
                      {OCCASION_ICONS[activity.occasion] || '🌱'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.occasion} • {format(new Date(activity.created_date), 'MMM d, yyyy')}
                  </p>
                  {activity.is_gift && activity.recipient_name && (
                    <p className="text-xs text-purple-600 font-medium">
                      Gift for {activity.recipient_name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{activity.total_amount}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {activity.planting_preference?.replace('_', ' ') || 'standard'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No activity yet</p>
          <p className="text-sm text-gray-500">Start planting to see your journey here</p>
        </div>
      )}
    </div>
  );
}