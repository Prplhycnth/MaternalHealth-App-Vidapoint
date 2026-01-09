import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Share2, 
  Building2, 
  Clock, 
  AlertTriangle,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'sharing-request' | 'appointment' | 'general';
  title: string;
  message: string;
  facility?: string;
  urgency?: 'emergency' | 'high' | 'medium' | 'low';
  timestamp: Date;
  isRead: boolean;
}

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSharing: () => void;
  pendingSharingRequests: number;
}

export function NotificationOverlay({ 
  isOpen, 
  onClose, 
  onNavigateToSharing,
  pendingSharingRequests 
}: NotificationOverlayProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'sharing-request',
        title: 'Health Record Sharing Request',
        message: 'Adventist Hospital Palawan is requesting access to your prenatal records',
        facility: 'Adventist Hospital Palawan',
        urgency: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'Your prenatal checkup is scheduled for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false
      },
      {
        id: '3',
        type: 'general',
        title: 'New Article Available',
        message: 'Learn about nutrition during your second trimester',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sharing-request': return Share2;
      case 'appointment': return Clock;
      default: return Bell;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    
    if (notification.type === 'sharing-request') {
      onClose();
      onNavigateToSharing();
    }
  };

  const sharingRequests = notifications.filter(n => n.type === 'sharing-request');
  const otherNotifications = notifications.filter(n => n.type !== 'sharing-request');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-sm mx-auto bg-white rounded-t-xl shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">Notifications</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Health Record Sharing Section */}
          {pendingSharingRequests > 0 && (
            <div className="p-4 border-b bg-orange-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-orange-800">Health Record Sharing</h3>
                <Badge className="bg-orange-500 text-white text-xs">
                  {pendingSharingRequests} pending
                </Badge>
              </div>
              
              <Card 
                className="border-orange-200 cursor-pointer transition-all active:scale-95"
                onClick={() => {
                  onClose();
                  onNavigateToSharing();
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800">
                        {pendingSharingRequests} facilities requesting access
                      </p>
                      <p className="text-xs text-orange-600">
                        Tap to review and respond
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Individual Sharing Request Notifications */}
          {sharingRequests.length > 0 && (
            <div className="p-4 border-b">
              <h3 className="font-medium text-sm text-muted-foreground mb-3">Recent Requests</h3>
              <div className="space-y-2">
                {sharingRequests.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all active:scale-95 ${
                        notification.isRead 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          notification.urgency ? getUrgencyColor(notification.urgency) : 'bg-blue-500'
                        }`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                            {notification.urgency && (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs h-4 ${getUrgencyColor(notification.urgency)} text-white`}
                              >
                                {notification.urgency}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Notifications */}
          {otherNotifications.length > 0 && (
            <div className="p-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-3">Other Notifications</h3>
              <div className="space-y-2">
                {otherNotifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all active:scale-95 ${
                        notification.isRead 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              onClose();
              onNavigateToSharing();
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            View All Sharing Requests
          </Button>
        </div>
      </div>
    </div>
  );
}