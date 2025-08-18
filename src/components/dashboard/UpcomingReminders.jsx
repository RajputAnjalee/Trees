
import React, { useState } from 'react';
import { Calendar, Gift, TreePine, Check, XCircle, Loader2 } from 'lucide-react'; // Added Check, XCircle, Loader2 for modal status
import { format } from 'date-fns';

export default function UpcomingReminders({ user, nextBirthday }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [notificationMessage, setNotificationMessage] = useState('');

  const getUpcomingEvents = () => {
    const events = [];
    
    if (nextBirthday && user?.date_of_birth) { // Ensure date_of_birth exists
      const age = nextBirthday.getFullYear() - new Date(user.date_of_birth).getFullYear();
      events.push({
        type: 'birthday',
        title: 'Your Birthday',
        date: nextBirthday,
        suggestion: `Plant ${age} saplings for your ${age}th birthday`,
        icon: '🎂',
        id: `user-birthday-${nextBirthday.toISOString()}` // Unique ID for key prop
      });
    }

    if (user?.family_members && user.family_members.length > 0) {
      user.family_members.forEach(member => {
        if (member.date_of_birth) {
          const memberBirthDate = new Date(member.date_of_birth);
          const today = new Date();
          const thisYear = today.getFullYear();
          
          let nextMemberBirthday = new Date(thisYear, memberBirthDate.getMonth(), memberBirthDate.getDate());
          // If the birthday this year has already passed, set it for next year
          if (nextMemberBirthday < today) {
            nextMemberBirthday = new Date(thisYear + 1, memberBirthDate.getMonth(), memberBirthDate.getDate());
          }
          
          const age = nextMemberBirthday.getFullYear() - memberBirthDate.getFullYear();
          
          events.push({
            type: 'family_birthday',
            title: `${member.name}'s Birthday`,
            date: nextMemberBirthday,
            suggestion: `Plant ${age} saplings for ${member.name}'s ${age}th birthday`,
            icon: '🎂',
            id: `family-birthday-${member.id || member.name}-${nextMemberBirthday.toISOString()}`
          });
        }
      });
    }

    // Add some upcoming festivals
    const today = new Date();
    
    // Diwali (approximate, for 2024 it's Nov 1st)
    // A more robust solution would involve a proper date library or API for lunar festivals.
    let diwaliDate = new Date(today.getFullYear(), 10, 1); // November 1st
    if (diwaliDate < today) { // If this year's Diwali has passed, consider next year
        diwaliDate = new Date(today.getFullYear() + 1, 10, 1);
    }
    events.push({
        type: 'festival',
        title: 'Diwali',
        date: diwaliDate,
        suggestion: 'Plant trees to celebrate the festival of lights',
        icon: '🪔',
        id: `festival-diwali-${diwaliDate.toISOString()}`
    });

    // Christmas (fixed date)
    let christmasDate = new Date(today.getFullYear(), 11, 25); // December 25th
    if (christmasDate < today) { // If this year's Christmas has passed, consider next year
        christmasDate = new Date(today.getFullYear() + 1, 11, 25);
    }
    events.push({
        type: 'festival',
        title: 'Christmas',
        date: christmasDate,
        suggestion: 'Spread joy by planting evergreen trees',
        icon: '🎄',
        id: `festival-christmas-${christmasDate.toISOString()}`
    });

    return events.sort((a, b) => a.date - b.date).slice(0, 3);
  };

  const upcomingEvents = getUpcomingEvents();

  const handleOpenConfirmModal = (event) => {
    setSelectedEvent(event);
    setShowConfirmModal(true);
    setNotificationStatus('idle'); // Reset status when opening modal
    setNotificationMessage('');
  };

  const handleConfirmPlanting = async () => {
    if (!selectedEvent) return;

    setNotificationStatus('loading');
    setNotificationMessage('Sending confirmation...');

    try {
      // Simulate API call to trigger email notification
      // In a real application, you would send a request to your backend:
      // const response = await fetch('/api/confirm-planting-action', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: user.id, // Assuming user has an ID for the backend
      //     eventId: selectedEvent.id,
      //     eventType: selectedEvent.type,
      //     eventTitle: selectedEvent.title,
      //     suggestion: selectedEvent.suggestion,
      //     date: selectedEvent.date.toISOString(),
      //   }),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to send confirmation.');
      // }

      // For demonstration purposes, simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      console.log('Confirmation for planting received:', selectedEvent);
      setNotificationStatus('success');
      setNotificationMessage('Confirmation sent! An email notification has been triggered.');
      
      // Optionally close modal after a short delay on success
      setTimeout(() => {
        setShowConfirmModal(false); 
        setSelectedEvent(null);
        setNotificationStatus('idle'); // Reset status for next interaction
        setNotificationMessage('');
      }, 1000);

    } catch (error) {
      console.error('Error confirming planting:', error);
      setNotificationStatus('error');
      setNotificationMessage(error.message || 'Failed to send confirmation. Please try again.');
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedEvent(null);
    setNotificationStatus('idle'); // Reset status on close
    setNotificationMessage('');
  };

  // Helper to check if the suggestion is about planting
  const isPlantingSuggestion = (suggestion) => 
    suggestion && suggestion.toLowerCase().includes('plant') && suggestion.toLowerCase().includes('saplings');


  return (
    <div className="neumorphic p-6 rounded-3xl">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Reminders</h3>
      
      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.map((event) => ( // Removed index, using event.id for key
            <div key={event.id} className="neumorphic-inset p-4 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="neumorphic-small p-3 rounded-xl">
                  {/* Using an icon based on event type */}
                  {event.type === 'festival' ? <Gift className="w-5 h-5 text-purple-600" /> : <Calendar className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{event.title}</span>
                    <span className="text-xl">{event.icon}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {format(event.date, 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-700 bg-white bg-opacity-50 p-2 rounded-lg mb-2">
                    💡 {event.suggestion}
                  </p>
                  {/* Only show 'Confirm Planting' button for relevant suggestions */}
                  {isPlantingSuggestion(event.suggestion) && (
                    <button
                      onClick={() => handleOpenConfirmModal(event)}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-200 ease-in-out neumorphic-button"
                    >
                      Confirm Planting
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No upcoming reminders</p>
          <p className="text-sm text-gray-500">We'll notify you of special occasions</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neumorphic p-8 rounded-3xl w-full max-w-md">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Confirm Action</h4>
            <p className="text-gray-700 mb-4">
              Are you sure you want to confirm the following action?
            </p>
            <div className="bg-white bg-opacity-40 p-4 rounded-xl mb-6">
                <p className="font-semibold text-gray-800 mb-1">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600 mb-2">{format(selectedEvent.date, 'MMM d, yyyy')}</p>
                <p className="text-sm text-gray-700">💡 {selectedEvent.suggestion}</p>
            </div>
            
            {/* Notification Status Display */}
            {notificationStatus === 'loading' && (
              <div className="flex items-center text-blue-600 mb-4">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>{notificationMessage}</span>
              </div>
            )}
            {notificationStatus === 'success' && (
              <div className="flex items-center text-green-600 mb-4">
                <Check className="w-5 h-5 mr-2" />
                <span>{notificationMessage}</span>
              </div>
            )}
            {notificationStatus === 'error' && (
              <div className="flex items-center text-red-600 mb-4">
                <XCircle className="w-5 h-5 mr-2" />
                <span>{notificationMessage}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseConfirmModal}
                className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-200 ease-in-out neumorphic-button-flat"
                disabled={notificationStatus === 'loading'} // Disable cancel during loading
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlanting}
                className="px-5 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out neumorphic-button"
                disabled={notificationStatus === 'loading'} // Disable confirm during loading
              >
                {notificationStatus === 'loading' ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
