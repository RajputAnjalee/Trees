import React from 'react';
import { TreePine, Gift, Leaf, IndianRupee } from 'lucide-react';

export default function OrderSummary({ orderData, totalCost, costPerSapling }) {
  return (
    <div className="neumorphic p-6 rounded-3xl sticky top-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
      
      <div className="space-y-4">
        <div className="neumorphic-inset p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <TreePine className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">Saplings</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{orderData.quantity} × ₹{costPerSapling}</span>
            <span className="font-bold text-gray-800">₹{orderData.quantity * costPerSapling}</span>
          </div>
        </div>

        {orderData.occasion && (
          <div className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Occasion</span>
            </div>
            <p className="text-gray-600 text-sm">{orderData.occasion}</p>
            {orderData.custom_note && (
              <p className="text-gray-500 text-xs mt-1 italic">"{orderData.custom_note}"</p>
            )}
          </div>
        )}

        {orderData.planting_preference && (
          <div className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <TreePine className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-800">Planting</span>
            </div>
            <p className="text-gray-600 text-sm">
              {orderData.planting_preference === 'self_plant' 
                ? 'Self-planted' 
                : 'Organization planted'}
            </p>
          </div>
        )}

        {orderData.is_gift && (
          <div className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-5 h-5 text-pink-600" />
              <span className="font-semibold text-gray-800">Gift</span>
            </div>
            <p className="text-gray-600 text-sm">For {orderData.recipient_name}</p>
            {orderData.sender_message && (
              <p className="text-gray-500 text-xs mt-1 italic">"{orderData.sender_message}"</p>
            )}
          </div>
        )}

        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{totalCost}</span>
            </div>
          </div>
        </div>

        <div className="neumorphic-inset p-4 rounded-2xl bg-green-50 bg-opacity-30">
          <p className="text-sm text-gray-700 text-center">
            🌱 You're contributing {orderData.quantity} trees toward your 1,000,000 goal!
          </p>
        </div>
      </div>
    </div>
  );
}