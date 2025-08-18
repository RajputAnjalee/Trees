import React, { useState, useEffect } from "react";
import { notificationAPI } from "@/services/notificationService";
import { Bell, MoreVertical, Check, Trash2, CheckCheck } from "lucide-react";
import { format } from "date-fns";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const loadNotifications = async (page = 1) => {
    try {
      const loading = page > 1 ? setIsLoadingMore : setIsLoading;
      loading(true);
      
      const [notificationsResponse, statsResponse] = await Promise.all([
        notificationAPI.getNotifications(page, pagination.itemsPerPage),
        notificationAPI.getStats()
      ]);
      
      setNotifications(prev => page === 1 
        ? notificationsResponse.notifications || []
        : [...prev, ...(notificationsResponse.notifications || [])]
      );
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: notificationsResponse.pagination?.totalPages || 1,
        totalItems: notificationsResponse.pagination?.totalItems || 0
      }));
      
      setStats({
        total: statsResponse.stats?.total || 0,
        unread: statsResponse.stats?.unread || 0,
        read: (statsResponse.stats?.total || 0) - (statsResponse.stats?.unread || 0)
      });
      
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setActionLoading(prev => ({ ...prev, [notificationId]: 'read' }));
    try {
      await notificationAPI.markAsRead(notificationId);
      await loadNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    setActionLoading(prev => ({ ...prev, [notificationId]: false }));
  };

  const handleDelete = async (notificationId) => {
    setActionLoading(prev => ({ ...prev, [notificationId]: 'delete' }));
    try {
      await notificationAPI.deleteNotification(notificationId);
      await loadNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
    setActionLoading(prev => ({ ...prev, [notificationId]: false }));
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(prev => ({ ...prev, 'all': 'read' }));
    try {
      await notificationAPI.markAllAsRead();
      await loadNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
    setActionLoading(prev => ({ ...prev, 'all': false }));
  };

  const handleDeleteAll = async () => {
    setActionLoading(prev => ({ ...prev, 'all': 'delete' }));
    try {
      await notificationAPI.deleteAllNotifications();
      await loadNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
    setActionLoading(prev => ({ ...prev, 'all': false }));
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
      {/* Header with Stats */}
      <div className="neumorphic p-8 rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="neumorphic-small p-4 rounded-2xl">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-600">
                {stats.total} total • {stats.unread} unread • {stats.read} read
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleMarkAllAsRead}
                disabled={actionLoading.all === 'read'}
                className="neumorphic-small px-4 py-2 rounded-2xl text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                {actionLoading.all === 'read' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    Marking...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4" />
                    Mark All Read
                  </div>
                )}
              </button>
              
              <button
                onClick={handleDeleteAll}
                disabled={actionLoading.all === 'delete'}
                className="neumorphic-small px-4 py-2 rounded-2xl text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {actionLoading.all === 'delete' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification._id} className={`neumorphic p-6 rounded-3xl ${notification.is_read ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="neumorphic-small p-3 rounded-2xl">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <div className="relative group">
                        <button className="neumorphic-small p-2 rounded-xl">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 min-w-[150px] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              disabled={actionLoading[notification._id] === 'read'}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            disabled={actionLoading[notification._id] === 'delete'}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                    <div className={`px-3 py-1 rounded-xl text-xs font-medium ${
                      notification.type === 'order_created' ? 'text-green-600 bg-green-50' :
                      notification.type === 'family_member_deleted' ? 'text-red-600 bg-red-50' :
                      notification.type === 'reminder' ? 'text-blue-600 bg-blue-50' :
                      notification.type === 'achievement' ? 'text-yellow-600 bg-yellow-50' :
                      'text-gray-600 bg-gray-50'
                    }`}>
                      {notification.type?.replace('_', ' ') || 'general'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => loadNotifications(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || isLoading || isLoadingMore}
                className="neumorphic-small px-4 py-2 rounded-2xl text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  // Calculate page number to show (centered around current page)
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => loadNotifications(pageNum)}
                      disabled={pagination.currentPage === pageNum || isLoading || isLoadingMore}
                      className={`w-10 h-10 rounded-2xl text-sm font-medium ${
                        pagination.currentPage === pageNum 
                          ? 'bg-blue-600 text-white' 
                          : 'neumorphic-small hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                
                {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                  <button
                    onClick={() => loadNotifications(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages || isLoading || isLoadingMore}
                    className={`w-10 h-10 rounded-2xl text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages 
                        ? 'bg-blue-600 text-white' 
                        : 'neumorphic-small hover:bg-gray-50'
                    }`}
                  >
                    {pagination.totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => loadNotifications(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || isLoading || isLoadingMore}
                className="neumorphic-small px-4 py-2 rounded-2xl text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
              
              <div className="flex items-center text-sm text-gray-600 ml-4">
                {pagination.totalItems > 0 && (
                  <span>
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {
                      Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)
                    } of {pagination.totalItems} notifications
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Load More Button (Alternative to pagination) */}
          {/* {pagination.currentPage < pagination.totalPages && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadNotifications(pagination.currentPage + 1)}
                disabled={isLoadingMore}
                className="neumorphic px-6 py-3 rounded-2xl text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : 'Load More Notifications'}
              </button>
            </div>
          )} */}
        </div>
      ) : (
        <div className="neumorphic p-12 rounded-3xl text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Notifications</h3>
          <p className="text-gray-600">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      )}
    </div>
  );
}