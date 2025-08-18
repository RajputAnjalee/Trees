
import React, { useState, useEffect } from "react";
import { getOrders, confirmPlanting } from "@/api/orders";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { TreePine, Gift, MapPin, Calendar, Package, CheckCircle, Clock, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setUser(userObj);
          const response = await getOrders(userObj.id);
          // Handle the API response structure with saplings array
          const userOrders = response.saplings || [];
          setOrders(userOrders);
        } else {
          setUser(null);
          setOrders([]);
        }
      } catch (error) {
        setUser(null);
        setOrders([]);
        console.error("Error loading orders:", error);
      }
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const handleConfirmPlanting = async (orderToConfirm) => {
    try {
      if (!user) return;
      const newStats = {
        total_trees_planted: (user.total_trees_planted || 0) + parseInt(orderToConfirm.quantity),
        trees_self_planted: (user.trees_self_planted || 0) + parseInt(orderToConfirm.quantity),
      };
      await confirmPlanting(orderToConfirm._id, user.id, parseInt(orderToConfirm.quantity), newStats);
      // Update local user stats
      const updatedUser = { ...user, ...newStats };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Refresh data
      const response = await getOrders(user.id);
      const userOrders = response.saplings || [];
      setOrders(userOrders);
      alert("Confirmation successful! Thank you for planting trees.");
    } catch (error) {
      console.error("Error confirming planting:", error);
      alert("There was an error confirming your planting. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'ready_for_collection':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'confirmed': // Added confirmed status
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Payment Completed';
      case 'pending':
        return 'Processing';
      case 'ready_for_collection':
        return 'Ready for Collection';
      case 'planted':
        return 'Planted';
      case 'confirmed':
        return 'Confirmed Planted'; // Added confirmed status text
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="neumorphic p-6 rounded-3xl animate-pulse">
            <div className="h-6 bg-gray-300 rounded-2xl w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded-xl w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="neumorphic p-8 rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">Track your tree planting journey</p>
          </div>
          <div className="neumorphic-small p-4 rounded-2xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="neumorphic p-6 rounded-3xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="neumorphic-small p-4 rounded-2xl">
                    {order.is_gift ? (
                      <Gift className="w-6 h-6 text-purple-600" />
                    ) : (
                      <TreePine className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {order.quantity} Saplings
                    </h3>
                    <p className="text-gray-600">Order #{order.order_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{order.total_amount}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(order.payment_status)}
                    <span className="text-sm font-medium text-gray-700">
                      {getStatusText(order.payment_status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="neumorphic-inset p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-700">Occasion</span>
                  </div>
                  <p className="text-gray-600">{order.occasion}</p>
                  {order.custom_note && (
                    <p className="text-xs text-gray-500 mt-1 italic">"{order.custom_note}"</p>
                  )}
                </div>

                <div className="neumorphic-inset p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-700">Planting</span>
                  </div>
                  <p className="text-gray-600">
                    {order.planting_preference === 'self_plant' 
                      ? 'Self-planted' 
                      : 'Organization planted'}
                  </p>
                </div>

                <div className="neumorphic-inset p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-700">Order Date</span>
                  </div>
                  <p className="text-gray-600">
                    {order.created_date && !isNaN(new Date(order.created_date))
                      ? format(new Date(order.created_date), 'MMM d, yyyy')
                      : '-'}
                  </p>
                </div>
                {order.planting_location && (
                  <div className="neumorphic-inset p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-gray-700">Location</span>
                    </div>
                    <p className="text-gray-600">{order.planting_location}</p>
                  </div>
                )}
              </div>

              {order.is_gift && (
                <div className="mt-4 neumorphic-inset p-4 rounded-2xl bg-purple-50 bg-opacity-30">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gray-700">Gift Details</span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Recipient:</strong> {order.recipient_name} ({order.recipient_email})
                  </p>
                  {order.sender_message && (
                    <p className="text-gray-600 mt-1">
                      <strong>Message:</strong> "{order.sender_message}"
                    </p>
                  )}
                </div>
              )}

              {/* Existing ready for collection message */}
              {order.planting_preference === 'self_plant' && order.planting_status === 'ready_for_collection' && (
                <div className="mt-4 neumorphic p-4 rounded-2xl bg-blue-50 bg-opacity-30">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-700">Ready for Collection!</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Your saplings are ready. Check your email for collection details.
                  </p>
                </div>
              )}

              {/* New: Confirm Planting Section */}
              {order.planting_preference === 'self_plant' && order.planting_status !== 'confirmed' && (
                <div className="mt-4 neumorphic p-4 rounded-2xl bg-green-50 bg-opacity-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <PartyPopper className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-700">Have you planted your saplings?</span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">
                        Let us know so we can add them to your goal!
                      </p>
                    </div>
                    <Button
                      onClick={() => handleConfirmPlanting(order)}
                      className="neumorphic-small px-4 py-2 rounded-xl font-semibold text-green-700 whitespace-nowrap"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      I've Planted This!
                    </Button>
                  </div>
                </div>
              )}

              {/* New: Planting Confirmed Message */}
              {order.planting_status === 'confirmed' && order.planting_preference === 'self_plant' && (
                 <div className="mt-4 neumorphic-inset p-4 rounded-2xl bg-green-50 bg-opacity-30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-700">Planting Confirmed!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Thank you! These {order.quantity} trees have been added to your total count.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="neumorphic p-12 rounded-3xl text-center">
          <TreePine className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">
            Start your tree planting journey by placing your first order
          </p>
          <a 
            href={createPageUrl("Purchase")}
            className="neumorphic-small px-8 py-4 rounded-2xl font-semibold text-green-700 inline-block hover:shadow-lg transition-all duration-200"
          >
            Plant Your First Trees
          </a>
        </div>
      )}
    </div>
  );
}
