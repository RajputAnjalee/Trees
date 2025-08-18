import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ConfirmationModal({ isOpen, onClose, orderDetails }) {
  if (!orderDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neumorphic p-8 rounded-3xl border-none">
        <DialogHeader className="text-center">
          <div className="mx-auto neumorphic-small p-4 rounded-2xl w-fit mb-4">
            <PartyPopper className="w-12 h-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Thank You for Your Contribution!
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Your order has been placed successfully. You are making a real difference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="neumorphic-inset p-6 rounded-2xl my-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-semibold text-gray-800">{orderDetails.order_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Saplings Planted:</span>
            <span className="font-semibold text-gray-800">{orderDetails.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold text-gray-800">₹{orderDetails.total_amount}</span>
          </div>
          {orderDetails.is_gift && (
            <div className="flex justify-between">
              <span className="text-gray-600">Gift for:</span>
              <span className="font-semibold text-gray-800">{orderDetails.recipient_name}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={onClose}
            className="flex-1 neumorphic-small px-6 py-3 rounded-2xl font-semibold text-gray-700"
          >
            Plant More Trees
          </Button>
          <Link to={createPageUrl("Orders")} className="flex-1">
            <Button className="w-full neumorphic-small px-6 py-3 rounded-2xl font-semibold text-blue-700">
              View My Orders
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}