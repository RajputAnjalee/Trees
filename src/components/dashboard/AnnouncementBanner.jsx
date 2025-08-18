import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AnnouncementBanner({ announcement }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <div className="neumorphic-inset p-4 rounded-3xl bg-blue-50 bg-opacity-30">
      <div className="flex items-start gap-4">
        <div className="neumorphic-small p-3 rounded-2xl mt-1">
          <Megaphone className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{announcement.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{announcement.message}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsVisible(false)}
          className="neumorphic-small rounded-full w-8 h-8"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}