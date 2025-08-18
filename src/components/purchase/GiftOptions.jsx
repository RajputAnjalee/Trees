import React from 'react';
import { Gift, Heart, Sparkles, TreePine } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GIFT_OCCASIONS = [
  { value: 'Birthday', emoji: '🎂', message: 'Wishing you growth and happiness!' },
  { value: 'Anniversary', emoji: '💍', message: 'Here\'s to growing old together like these trees!' },
  { value: 'New Baby', emoji: '👶', message: 'Welcome to the world, little one!' },
  { value: 'Graduation', emoji: '🎓', message: 'Your future is as bright as these trees!' },
  { value: 'New Home', emoji: '🏠', message: 'May your new home flourish!' },
  { value: 'Get Well Soon', emoji: '🌸', message: 'Healing thoughts and growing wishes!' },
  { value: 'Thank You', emoji: '🙏', message: 'Thank you for making a difference!' },
  { value: 'Just Because', emoji: '💚', message: 'Thinking of you and our planet!' }
];

export default function GiftOptions({ orderData, updateOrderData }) {
  const selectedOccasion = GIFT_OCCASIONS.find(occ => occ.value === orderData.occasion);

  return (
    <div className="neumorphic-inset p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Gift Details</h3>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipient_name" className="text-gray-700 font-semibold">Recipient Name</Label>
            <Input
              id="recipient_name"
              value={orderData.recipient_name}
              onChange={(e) => updateOrderData('recipient_name', e.target.value)}
              placeholder="Who is this gift for?"
              className="neumorphic-inset border-none mt-2"
            />
          </div>
          <div>
            <Label htmlFor="recipient_email" className="text-gray-700 font-semibold">Recipient Email</Label>
            <Input
              id="recipient_email"
              type="email"
              value={orderData.recipient_email}
              onChange={(e) => updateOrderData('recipient_email', e.target.value)}
              placeholder="their.email@example.com"
              className="neumorphic-inset border-none mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="gift_occasion" className="text-gray-700 font-semibold">Gift Occasion</Label>
          <Select 
            value={orderData.occasion} 
            onValueChange={(value) => {
              updateOrderData('occasion', value);
              const occasion = GIFT_OCCASIONS.find(occ => occ.value === value);
              if (occasion && !orderData.sender_message) {
                updateOrderData('sender_message', occasion.message);
              }
            }}
          >
            <SelectTrigger className="neumorphic-inset border-none mt-2">
              <SelectValue placeholder="What's the occasion?" />
            </SelectTrigger>
            <SelectContent>
              {GIFT_OCCASIONS.map((occasion) => (
                <SelectItem key={occasion.value} value={occasion.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{occasion.emoji}</span>
                    <span>{occasion.value}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sender_message" className="text-gray-700 font-semibold">Your Message</Label>
          <Textarea
            id="sender_message"
            value={orderData.sender_message}
            onChange={(e) => updateOrderData('sender_message', e.target.value)}
            placeholder="Write a heartfelt message..."
            className="neumorphic-inset border-none mt-2 h-24"
          />
          {selectedOccasion && (
            <p className="text-xs text-gray-500 mt-1">
              💡 Suggested: "{selectedOccasion.message}"
            </p>
          )}
        </div>

        <div className="neumorphic-inset p-4 rounded-2xl bg-purple-50 bg-opacity-30">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">What happens next?</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your recipient will receive a beautiful digital certificate</li>
                <li>• They'll be notified about the trees planted in their honor</li>
                <li>• The trees will be added to their account (if they have one)</li>
                <li>• You'll both get updates on the planting progress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}