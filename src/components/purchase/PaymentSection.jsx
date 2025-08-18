import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building, CheckCircle } from 'lucide-react';

export default function PaymentSection({ orderData, totalCost, onPlaceOrder }) {
  return (
    <div className="space-y-6">
      {/* Order Review */}
      <div className="neumorphic-inset p-6 rounded-2xl">
        <h3 className="font-bold text-gray-800 mb-4">Order Review</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Saplings</span>
            <span className="font-semibold">{orderData.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Occasion</span>
            <span className="font-semibold">{orderData.occasion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Planting</span>
            <span className="font-semibold">
              {orderData.planting_preference === 'self_plant' ? 'Self' : 'Organization'}
            </span>
          </div>
          {orderData.is_gift && (
            <div className="flex justify-between">
              <span className="text-gray-600">Gift for</span>
              <span className="font-semibold">{orderData.recipient_name}</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-green-600">₹{totalCost}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="neumorphic p-6 rounded-2xl">
        <h3 className="font-bold text-gray-800 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <div className="neumorphic-inset p-4 rounded-xl flex items-center gap-4">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-800">UPI</p>
              <p className="text-sm text-gray-600">Pay with any UPI app</p>
            </div>
          </div>
          <div className="neumorphic-inset p-4 rounded-xl flex items-center gap-4">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-gray-800">Card</p>
              <p className="text-sm text-gray-600">Debit or Credit Card</p>
            </div>
          </div>
          <div className="neumorphic-inset p-4 rounded-xl flex items-center gap-4">
            <Building className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-gray-800">Net Banking</p>
              <p className="text-sm text-gray-600">Pay with your bank account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Order Button */}
      <Button
        onClick={onPlaceOrder}
        className="w-full neumorphic py-6 rounded-2xl text-lg font-bold text-green-700 hover:shadow-lg transition-all duration-200"
      >
        <CheckCircle className="w-6 h-6 mr-3" />
        Complete Order - ₹{totalCost}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <p>🔒 Secure payment powered by trusted payment gateways</p>
        <p className="mt-1">Your contribution helps build a greener future</p>
      </div>
    </div>
  );
}