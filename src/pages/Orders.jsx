
import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { TreePine, Gift, MapPin, Calendar, Package, CheckCircle, Clock, PartyPopper, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders, confirmPlanting, deleteOrder } from "@/api/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAll, setShowAll] = useState(false); // New state for showing all orders
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // New state for delete confirmation dialog
  const [orderToDelete, setOrderToDelete] = useState(null); // New state to store the order to be deleted

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true); // Move this inside, as per outline
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
        const response = await getOrders(userObj.id);
        setOrders(response.saplings || []);
      } else {
        setUser(null);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete._id); // Assuming _id is the key for deletion
      await loadOrders(); // Refresh the list
      setDeleteDialogOpen(false); // Close dialog
      setOrderToDelete(null); // Clear selected order
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("There was an error deleting the order. Please try again.");
    }
  };

  const handleConfirmPlanting = async (orderToConfirm) => {
    try {
      // Use the new API call which should handle both user stats and order status updates on the backend
      await confirmPlanting(orderToConfirm._id, orderToConfirm.quantity);

      // Refresh data
      await loadOrders();
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
        <div className="space-y-4">
          <div className="space-y-6">
            {orders.slice(0, showAll ? orders.length : 3).map((order) => (
            <div key={order._id} className="neumorphic p-6 rounded-3xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="neumorphic-small p-4 rounded-2xl">
                      {order.is_gift ? (
                        <Gift className="w-6 h-6 text-purple-600" />
                      ) : (
                        <TreePine className="w-6 h-6 text-green-600" />
                      )}
                    </div>
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
                  <div className="flex items-center justify-end gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.payment_status)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(order.payment_status)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(order);
                      }}
                      className="neumorphic-small p-2 rounded-xl text-red-600 hover:bg-red-100"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                    {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy') : 'N/A'}
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
            
            {orders.length > 3 && (
              <div className="flex justify-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAll(!showAll)}
                  className="text-green-600 border-green-600 hover:bg-green-50 neumorphic-small"
                >
                  {showAll ? 'Show Less' : `Show All (${orders.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="neumorphic p-12 rounded-3xl text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">Your tree planting journey will appear here</p>
          <a
            href={createPageUrl("Purchase")}
            className="neumorphic-small px-8 py-4 rounded-2xl font-semibold text-green-700 inline-block hover:shadow-lg transition-all duration-200"
          >
            Plant Your First Trees
          </a>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="neumorphic p-8 rounded-3xl border-none">
            <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                    <div className="neumorphic-small p-4 rounded-full">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <AlertDialogTitle className="text-center text-2xl font-bold text-red-700">
                    Delete Order Confirmation
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-gray-600 pt-2">
                    Are you sure you want to delete this order for{' '}
                    <strong>{orderToDelete?.quantity} sapling{orderToDelete?.quantity > 1 ? 's' : ''}</strong>? 
                    This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex gap-4">
                <AlertDialogCancel asChild>
                    <Button className="flex-1 neumorphic-small px-6 py-3 rounded-2xl font-semibold text-gray-700">
                        Cancel
                    </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button
                        onClick={handleDeleteOrder}
                        className="flex-1 neumorphic-small px-6 py-3 rounded-2xl font-semibold bg-red-500 hover:bg-red-600 text-white"
                    >
                        Yes, Delete
                    </Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
