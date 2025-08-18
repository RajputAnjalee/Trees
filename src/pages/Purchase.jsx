
import React, { useState, useEffect } from "react";
import { createOrder } from "@/api/purchase";
import { SendEmail } from "@/api/integrations";
import { TreePine, Gift, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import PurchaseStep from "../components/purchase/PurchaseStep";
import OrderSummary from "../components/purchase/OrderSummary";
import PaymentSection from "../components/purchase/PaymentSection";
import GiftOptions from "../components/purchase/GiftOptions";
import ConfirmationModal from "../components/purchase/ConfirmationModal";

const OCCASIONS = [
  "Birthday", "Anniversary", "New Baby", "In Memory Of", 
  "Graduation", "New Home", "Festival", "General Contribution"
];

const COST_PER_SAPLING = 15;

export default function Purchase() {
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    quantity: 1,
    occasion: "",
    custom_note: "",
    planting_preference: "",
    is_gift: false,
    recipient_name: "",
    recipient_email: "",
    sender_message: ""
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Fix: define getTotalCost as a function

  const getTotalCost = () => orderData.quantity * COST_PER_SAPLING;

  // Make updateOrderData available in component scope
  const updateOrderData = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
        // Suggest quantity based on age
        if (userObj?.date_of_birth) {
          const birthDate = new Date(userObj.date_of_birth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age > 0) {
            setOrderData(prev => ({ ...prev, quantity: age }));
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Use a default order id since payment gateway is not integrated
      const orderId = 'ORD-DEFAULT-001';
      const newOrder = {
        order_id: orderId,
        user_id: user?.id,
        quantity: orderData.quantity,
        occasion: orderData.occasion,
        custom_note: orderData.custom_note,
        planting_preference: orderData.planting_preference,
        total_amount: getTotalCost(),
        payment_status: "completed",
        planting_status: orderData.planting_preference === 'self_plant' ? 'ready_for_collection' : 'pending',
        is_gift: orderData.is_gift,
        recipient_name: orderData.recipient_name,
        recipient_email: orderData.recipient_email,
        sender_message: orderData.sender_message
      };
      await createOrder(newOrder);
      setConfirmedOrder(newOrder);
      setShowConfirmation(true);
      
      // Send receipt to purchaser
      // await SendEmail({
      //   to: user.email,
      //   subject: `Your Tree Planting Order Confirmation (#${orderId})`,
      //   body: `
      //     <h1>Thank you for your order!</h1>
      //     <p>You're making a difference by planting ${orderData.quantity} trees.</p>
      //     <p><strong>Order ID:</strong> ${orderId}</p>
      //     <p><strong>Total Amount:</strong> ₹${getTotalCost()}</p>
      //     <p>You can view your order details in the app.</p>
      //     <br/>
      //     <p>With gratitude,</p>
      //     <p>The 1000000beforeidie Team</p>
      //   `
      // });

      // Send notification to gift recipient
      // if (orderData.is_gift && orderData.recipient_email) {
      //   await SendEmail({
      //     to: orderData.recipient_email,
      //     from_name: `${user.full_name} (via 1000000beforeidie)`,
      //     subject: `A Gift of Trees from ${user.full_name}!`,
      //     body: `
      //       <h1>You've Received a Gift!</h1>
      //       <p>${user.full_name} has planted ${orderData.quantity} trees in your honor for the occasion of ${orderData.occasion}.</p>
      //       <p><strong>Message from sender:</strong></p>
      //       <p><em>"${orderData.sender_message}"</em></p>
      //       <br/>
      //       <p>These trees are a gift to you and to our planet.</p>
      //       <p>The 1000000beforeidie Team</p>
      //     `
      //   });
      // }
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedOrder(null);
    // Reset form
    setCurrentStep(1);
    setOrderData({
      quantity: 1,
      occasion: "",
      custom_note: "",
      planting_preference: "",
      is_gift: false,
      recipient_name: "",
      recipient_email: "",
      sender_message: ""
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={closeConfirmation}
        orderDetails={confirmedOrder}
      />

      {/* Header */}
      <div className="neumorphic p-8 rounded-3xl text-center">
        <TreePine className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Plant Your Trees</h1>
        <p className="text-gray-600">Every sapling brings you closer to your million tree goal</p>
      </div>

      {/* Progress Steps */}
      <div className="neumorphic p-6 rounded-3xl">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                ${currentStep >= step 
                  ? 'neumorphic-pressed text-green-700' 
                  : 'neumorphic-small text-gray-500'
                }
              `}>
                {step}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-800">
                  {step === 1 && "Select Saplings"}
                  {step === 2 && "Choose Options"}
                  {step === 3 && "Complete Order"}
                </p>
              </div>
              {step < 3 && (
                <ArrowRight className="w-6 h-6 text-gray-400 mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <PurchaseStep
              title="How many saplings would you like to plant?"
              subtitle="We've suggested a quantity based on your age, but feel free to adjust"
            >
              <div className="space-y-6">
                <div>
                  <Label htmlFor="quantity" className="text-gray-700 font-semibold">Number of Saplings</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={orderData.quantity}
                    onChange={(e) => updateOrderData('quantity', parseInt(e.target.value) || 1)}
                    className="neumorphic-inset border-none text-lg font-semibold text-center py-4 mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-2">Cost per sapling: ₹{COST_PER_SAPLING}</p>
                </div>

                <div>
                  <Label htmlFor="occasion" className="text-gray-700 font-semibold">What's the occasion?</Label>
                  <Select value={orderData.occasion} onValueChange={(value) => updateOrderData('occasion', value)}>
                    <SelectTrigger className="neumorphic-inset border-none py-4 mt-2">
                      <SelectValue placeholder="Select an occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {OCCASIONS.map((occasion) => (
                        <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="custom_note" className="text-gray-700 font-semibold">Custom Note (Optional)</Label>
                  <Textarea
                    id="custom_note"
                    value={orderData.custom_note}
                    onChange={(e) => updateOrderData('custom_note', e.target.value)}
                    placeholder="Add a personal note for this planting..."
                    className="neumorphic-inset border-none mt-2"
                  />
                </div>
              </div>
            </PurchaseStep>
          )}

          {currentStep === 2 && (
            <PurchaseStep
              title="How would you like to plant these saplings?"
              subtitle="Choose whether you'll plant them yourself or have our organization help"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <div 
                    className={`neumorphic p-6 rounded-2xl cursor-pointer transition-all duration-200 ${
                      orderData.planting_preference === 'self_plant' ? 'neumorphic-pressed' : ''
                    }`}
                    onClick={() => updateOrderData('planting_preference', 'self_plant')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        orderData.planting_preference === 'self_plant' 
                          ? 'bg-green-600 border-green-600' : 'border-gray-400'
                      }`}>
                        {orderData.planting_preference === 'self_plant' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">I will plant myself</h3>
                        <p className="text-gray-600 text-sm">Receive saplings for self-planting</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`neumorphic p-6 rounded-2xl cursor-pointer transition-all duration-200 ${
                      orderData.planting_preference === 'organization_plant' ? 'neumorphic-pressed' : ''
                    }`}
                    onClick={() => updateOrderData('planting_preference', 'organization_plant')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        orderData.planting_preference === 'organization_plant' 
                          ? 'bg-green-600 border-green-600' : 'border-gray-400'
                      }`}>
                        {orderData.planting_preference === 'organization_plant' && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Organization to plant for me</h3>
                        <p className="text-gray-600 text-sm">We'll plant the saplings on your behalf</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="neumorphic-inset p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Checkbox
                      id="is_gift"
                      checked={orderData.is_gift}
                      onCheckedChange={(checked) => updateOrderData('is_gift', checked)}
                    />
                    <Label htmlFor="is_gift" className="font-semibold text-gray-800">
                      <Gift className="w-4 h-4 inline mr-2" />
                      This is a gift
                    </Label>
                  </div>

                  {orderData.is_gift && (
                    <GiftOptions 
                      orderData={orderData}
                      updateOrderData={updateOrderData}
                    />
                  )}
                </div>
              </div>
            </PurchaseStep>
          )}

          {currentStep === 3 && (
            <PurchaseStep
              title="Complete Your Order"
              subtitle="Review your order and complete the payment"
            >
              <PaymentSection
                orderData={orderData}
                totalCost={getTotalCost()}
                onPlaceOrder={handlePlaceOrder}
              />
            </PurchaseStep>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-gray-700 disabled:opacity-50"
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && (!orderData.occasion || orderData.quantity < 1)) ||
                  (currentStep === 2 && !orderData.planting_preference)
                }
                className="neumorphic-small px-6 py-3 rounded-2xl font-semibold text-green-700 disabled:opacity-50"
              >
                Next Step
              </Button>
            ) : null}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            orderData={orderData}
            totalCost={getTotalCost()}
            costPerSapling={COST_PER_SAPLING}
          />
        </div>
      </div>
    </div>
  );
}
