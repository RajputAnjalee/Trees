
import React, { useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TreePine, User, ShoppingCart, BarChart3, Leaf, Bell } from "lucide-react";
import { profile } from "@/api/auth";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { NotificationToastContainer } from "@/components/notifications/NotificationToast";
import { initializePushNotifications, setupForegroundMessageHandler } from "@/services/notificationService";
import useNotifications from "@/hooks/useNotifications";

export default function Layout({ children, currentPageName }) {
  // If no user or token in localStorage, only allow Welcome or Register pages
  const storedUser = localStorage.getItem('user');
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  const token = userObj?.token;

  if (!token && currentPageName !== "Welcome" && currentPageName !== "Register" && currentPageName !== "ForgotPassword") {
    // If not authenticated, redirect to Welcome page
    return <Navigate to="/Welcome" replace />;
  }

  // If on Welcome or Register, render directly
  if (currentPageName === "Welcome" || currentPageName === "Register" || currentPageName === "ForgotPassword") {
    return <>{children}</>;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Store user info if needed
  const [user, setUser] = useState(null);
  
  // Initialize notification handling
  useNotifications();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          // Optionally, re-fetch profile to validate session
          const freshUser = await profile(userObj.id);
          setUser(freshUser);
          setIsAuthenticated(true);
          
          // Initialize push notifications after authentication
          try {
            await initializePushNotifications();
            
            // Setup foreground message handler
            setupForegroundMessageHandler((notification) => {
              // Show toast notification when message received in foreground
              if (window.showNotificationToast) {
                window.showNotificationToast(notification);
              }
            });
          } catch (error) {
            console.error('Failed to initialize push notifications:', error);
          }
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('user');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [currentPageName]);

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: BarChart3,
    },
    {
      title: "Plant Trees",
      url: createPageUrl("Purchase"),
      icon: TreePine,
    },
    {
      title: "My Orders",
      url: createPageUrl("Orders"),
      icon: ShoppingCart,
    },
    {
      title: "Notifications",
      url: createPageUrl("Notifications"),
      icon: Bell,
    },
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: User,
    },
  ];

  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  // For any page other than Welcome/Register, if not authenticated, show an auth message.
  // The platform's security will handle the login prompt.
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render full layout with header and sidebar for authenticated users.
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      <style>{`
        .neumorphic {
          background: #e0e0e0;
          box-shadow: 
            8px 8px 16px #bebebe,
            -8px -8px 16px #ffffff;
        }
        
        .neumorphic-inset {
          background: #e0e0e0;
          box-shadow: 
            inset 6px 6px 12px #bebebe,
            inset -6px -6px 12px #ffffff;
        }
        
        .neumorphic-pressed {
          background: #e0e0e0;
          box-shadow: 
            inset 4px 4px 8px #bebebe,
            inset -4px -4px 8px #ffffff;
        }
        
        .neumorphic-small {
          background: #e0e0e0;
          box-shadow: 
            4px 4px 8px #bebebe,
            -4px -4px 8px #ffffff;
        }
        
        .nav-active {
          background: #e0e0e0;
          box-shadow: 
            inset 3px 3px 6px #bebebe,
            inset -3px -3px 6px #ffffff;
        }
        
        .nav-inactive:hover {
          box-shadow: 
            6px 6px 12px #bebebe,
            -6px -6px 12px #ffffff;
        }
        
        .tree-progress {
          background: linear-gradient(135deg, #4ade80, #22c55e);
        }
      `}</style>

      {/* Header */}
      <header className="neumorphic p-6 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="neumorphic-small p-4 rounded-2xl">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">1000000beforeidie</h1>
              <p className="text-gray-600 text-sm">Plant a million trees in your lifetime</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="neumorphic-small px-6 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">Goal: 1,000,000</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="neumorphic p-6 rounded-3xl">
              <div className="space-y-3">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
                        ${isActive 
                          ? 'nav-active text-green-700' 
                          : 'nav-inactive text-gray-700 hover:text-green-600'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Toast Container */}
      <NotificationToastContainer />
    </div>
  );
}
