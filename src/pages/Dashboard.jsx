
import React, { useState, useEffect } from "react";
import { profile, getRecentActivities } from "@/api/auth";
import { TreePine, Gift, Calendar, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsCard from "../components/dashboard/StatsCard";
import ProgressCircle from "../components/dashboard/ProgressCircle";
import RecentActivity from "../components/dashboard/RecentActivity";
import UpcomingReminders from "../components/dashboard/UpcomingReminders";
import AchievementBadge from "../components/dashboard/AchievementBadge";
import BirthdayReminders from "../components/dashboard/BirthdayReminders";
import FestivalReminders from "../components/dashboard/FestivalReminders";
import AnnouncementBanner from "../components/dashboard/AnnouncementBanner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalThisMonth: 0,
    totalThisYear: 0,
    totalGifts: 0,
    totalSaplings: 0,
    totalAmount: 0,
    monthlyTrend: 0,
  });

  // Simulated announcement from the organization
  const announcement = {
    title: "New Planting Drive in the Western Ghats!",
    message: "This monsoon, we're aiming to plant 50,000 saplings in the biodiversity hotspot of the Western Ghats. Every contribution helps!"
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (!userObj?._id) {
            throw new Error('User ID not found in stored user data');
          }
          
          // Fetch user profile and recent activities in parallel
          const [profileResponse, recentActivities] = await Promise.all([
            profile(userObj._id),
            getRecentActivities()
          ]);
          
          // Update user state with the profile data
          setUser(profileResponse);
          
          // Set activities from the recent activities response
          const activitiesData = recentActivities.activities || [];
          setActivities(activitiesData);
          
          // Calculate statistics
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          const monthlyData = activitiesData.filter(activity => {
            const activityDate = new Date(activity.created_date);
            return activityDate.getMonth() === currentMonth && 
                   activityDate.getFullYear() === currentYear;
          });
          
          const yearlyData = activitiesData.filter(activity => {
            return new Date(activity.created_date).getFullYear() === currentYear;
          });
          
          // Calculate previous month for trend
          const prevMonthData = activitiesData.filter(activity => {
            const activityDate = new Date(activity.created_date);
            return activityDate.getMonth() === (currentMonth - 1 + 12) % 12 && 
                   activityDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
          });
          
          const totalThisMonth = monthlyData.reduce((sum, activity) => sum + parseInt(activity.quantity || 0), 0);
          const prevMonthTotal = prevMonthData.reduce((sum, activity) => sum + parseInt(activity.quantity || 0), 0);
          const monthlyTrend = prevMonthTotal > 0 
            ? Math.round(((totalThisMonth - prevMonthTotal) / prevMonthTotal) * 100) 
            : totalThisMonth > 0 ? 100 : 0;
          
          setStats({
            totalOrders: activitiesData.length,
            totalThisMonth: monthlyData.length,
            totalThisYear: yearlyData.length,
            totalGifts: activitiesData.filter(a => a.is_gift).length,
            totalSaplings: activitiesData.reduce((sum, a) => sum + parseInt(a.quantity || 0), 0),
            totalAmount: activitiesData.reduce((sum, a) => sum + parseFloat(a.total_amount || 0), 0),
            monthlyTrend: monthlyTrend
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Error loading user data:", error);
      }
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage with sign
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  const getProgressPercentage = () => {
    if (!user?.total_trees_planted) return 0;
    return Math.min((user.total_trees_planted / 1000000) * 100, 100);
  };

  const getNextBirthday = () => {
    if (!user?.date_of_birth) return null;
    
    const today = new Date();
    const birthDate = new Date(user.date_of_birth);
    const thisYear = today.getFullYear();
    
    let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    return nextBirthday;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="neumorphic p-8 rounded-3xl animate-pulse">
          <div className="h-8 bg-gray-300 rounded-2xl w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded-xl w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Announcement Banner */}
      <AnnouncementBanner announcement={announcement} />

      {/* Welcome Section */}
      <div className="neumorphic p-8 rounded-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.full_name}!
            </h2>
            <p className="text-gray-600">
              {user?.account_type === 'family' 
                ? `Managing your family's journey to plant 1 million trees`
                : `Your personal journey to plant 1 million trees`}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="neumorphic-small px-3 py-1 rounded-xl text-green-700 font-medium">
                {((user?.total_trees_planted || 0) / 1000000 * 100).toFixed(3)}% Complete
              </span>
              <span className="text-gray-600">
                {(1000000 - (user?.total_trees_planted || 0)).toLocaleString()} trees to go
              </span>
            </div>
          </div>
          <Link 
            to={createPageUrl("Purchase")} 
            className="neumorphic px-6 py-4 rounded-2xl text-green-700 font-bold hover:shadow-lg transition-all duration-200"
          >
            <TreePine className="w-5 h-5 inline mr-2" />
            Plant Trees
          </Link>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Card - Takes more width */}
        <div className="lg:col-span-7">
          <div className="neumorphic p-6 rounded-3xl h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProgressCircle 
                percentage={getProgressPercentage()}
                treesPlanted={user?.total_trees_planted || 0}
              />
              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="neumorphic-inset p-4 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Planted by You</p>
                    <p className="text-2xl font-bold text-green-600">{user?.trees_self_planted || 0}</p>
                    <p className="text-xs text-gray-500">Personal Contribution</p>
                  </div>
                  <div className="neumorphic-inset p-4 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Organization</p>
                    <p className="text-2xl font-bold text-blue-600">{user?.trees_org_planted || 0}</p>
                    <p className="text-xs text-gray-500">Team Effort</p>
                  </div>
                </div>
                <div className="neumorphic p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Progress</p>
                      <p className="text-lg font-bold text-gray-800">
                        {(user?.total_trees_planted || 0).toLocaleString()}
                        <span className="text-sm font-normal text-gray-500"> / 1,000,000 trees</span>
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {getProgressPercentage().toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Takes less width */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-4 h-full">
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={TreePine}
              trend={`${formatPercentage(stats.monthlyTrend)} this month`}
              trendType={stats.monthlyTrend >= 0 ? 'positive' : 'negative'}
            />
            <StatsCard
              title="This Month"
              value={stats.totalThisMonth}
              icon={Calendar}
              trend={`${stats.totalThisYear} this year`}
            />
            <StatsCard
              title="Total Gifts"
              value={stats.totalGifts}
              icon={Gift}
              trend={`${stats.totalOrders > 0 ? Math.round((stats.totalGifts / stats.totalOrders) * 100) : 0}% of orders`}
            />
            <StatsCard
              title="Total Saplings"
              value={stats.totalSaplings}
              icon={Target}
              trend={formatCurrency(stats.totalAmount)}
            />
          </div>
        </div>
      </div>

      {/* Achievements & Reminders */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AchievementBadge treesPlanted={user?.total_trees_planted || 0} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <BirthdayReminders user={user} />
          <FestivalReminders />
        </div>
      </div> */}

      {/* Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity activities={activities.slice(0, 5)} />
      </div>
    </div>
  );
}
