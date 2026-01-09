import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  BookOpen,
  Share2,
  Building2,
  CheckCircle,
  Clock,
  Bell,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  isFirstTimeUser?: boolean;
}

interface Notification {
  id: string;
  type: 'appointment' | 'sharing' | 'record' | 'article' | 'missed';
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  actionable?: boolean;
}

export function Notifications({ onBack, onNavigate, isFirstTimeUser = false }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(isFirstTimeUser ? [
    {
      id: 'welcome',
      type: 'article',
      title: 'Welcome to VidaPoint!',
      message: 'Start your maternal health journey with us. Explore features and book your first appointment.',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      actionable: false
    }
  ] : [
    {
      id: 'missed-1',
      type: 'missed',
      title: 'Missed Appointment',
      message: 'You missed your appointment on January 10 at 2:00 PM with Dr. Santos',
      date: '2025-01-11',
      time: '09:00 AM',
      read: false,
      actionable: true
    },
    {
      id: '1',
      type: 'sharing',
      title: 'Health Record Access Request',
      message: 'Montes Medical Clinic is requesting access to your health records',
      date: '2025-01-15',
      time: '10:30 AM',
      read: false,
      actionable: true
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Santos is tomorrow at 2:00 PM',
      date: '2025-01-15',
      time: '09:00 AM',
      read: false,
      actionable: false
    },
    {
      id: '3',
      type: 'record',
      title: 'Health Record Updated',
      message: 'Lab results from Puerto Princesa General Hospital have been added',
      date: '2025-01-14',
      time: '03:45 PM',
      read: true,
      actionable: false
    },
    {
      id: '4',
      type: 'article',
      title: 'New Health Article',
      message: 'New article: "Second Trimester Nutrition Guide"',
      date: '2025-01-13',
      time: '08:00 AM',
      read: true,
      actionable: false
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment for January 30 has been confirmed',
      date: '2025-01-12',
      time: '02:15 PM',
      read: true,
      actionable: false
    },
    {
      id: '6',
      type: 'record',
      title: 'Vaccination Record Added',
      message: 'Tetanus Toxoid vaccination has been recorded',
      date: '2025-01-10',
      time: '11:20 AM',
      read: true,
      actionable: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const appointmentNotifications = notifications.filter(n => n.type === 'appointment');
  const sharingNotifications = notifications.filter(n => n.type === 'sharing');
  const recordNotifications = notifications.filter(n => n.type === 'record');
  const articleNotifications = notifications.filter(n => n.type === 'article');
  const missedNotifications = notifications.filter(n => n.type === 'missed');

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'missed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'sharing':
        return <Share2 className="w-5 h-5 text-orange-600" />;
      case 'record':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'article':
        return <BookOpen className="w-5 h-5 text-pink-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-purple-100';
      case 'missed':
        return 'bg-red-100';
      case 'sharing':
        return 'bg-orange-100';
      case 'record':
        return 'bg-blue-100';
      case 'article':
        return 'bg-pink-100';
      default:
        return 'bg-gray-100';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.actionable) {
      if (notification.type === 'sharing') {
        onNavigate('health-record-sharing');
      } else if (notification.type === 'missed') {
        onNavigate('appointments');
      }
    } else {
      // Just mark as read for non-actionable notifications
      switch (notification.type) {
        case 'appointment':
          onNavigate('appointments');
          break;
        case 'record':
          onNavigate('records');
          break;
        case 'article':
          onNavigate('articles');
          break;
      }
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <Card 
      key={notification.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
      } ${notification.type === 'missed' && !notification.read ? 'border-l-red-500 bg-red-50' : ''}`}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 ${getIconBg(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
              >
                <Trash2 className="w-3 h-3 text-gray-400" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-xs text-muted-foreground">
                {new Date(notification.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} • {notification.time}
              </p>
              {!notification.read && (
                <Badge className="bg-blue-500 text-white text-xs h-4 px-1.5">
                  New
                </Badge>
              )}
              {notification.actionable && (
                <Badge variant="outline" className="text-xs h-4 px-1.5">
                  Action Required
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-medium">Notifications</h1>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-xs px-2 py-2">
              <div className="flex flex-col items-center gap-1">
                <Bell className="w-4 h-4" />
                <span>All</span>
                {unreadCount > 0 && (
                  <Badge className="bg-blue-500 text-white text-xs h-4 px-1.5 min-w-[1rem]">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs px-2 py-2">
              <div className="flex flex-col items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Appts</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="sharing" className="text-xs px-2 py-2">
              <div className="flex flex-col items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>Sharing</span>
                {sharingNotifications.filter(n => !n.read).length > 0 && (
                  <Badge className="bg-orange-500 text-white text-xs h-4 px-1.5 min-w-[1rem]">
                    {sharingNotifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="records" className="text-xs px-2 py-2">
              <div className="flex flex-col items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Records</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-xs px-2 py-2">
              <div className="flex flex-col items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>Articles</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map(notification => renderNotificationCard(notification))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    You're all caught up!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Appointment Notifications */}
          <TabsContent value="appointments" className="space-y-3">
            {appointmentNotifications.length > 0 ? (
              appointmentNotifications.map(notification => renderNotificationCard(notification))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Appointment Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    No appointment reminders or updates
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sharing Notifications */}
          <TabsContent value="sharing" className="space-y-3">
            {sharingNotifications.length > 0 ? (
              sharingNotifications.map(notification => renderNotificationCard(notification))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Sharing Requests</h3>
                  <p className="text-gray-600 text-sm">
                    No health record sharing requests
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Record Notifications */}
          <TabsContent value="records" className="space-y-3">
            {recordNotifications.length > 0 ? (
              recordNotifications.map(notification => renderNotificationCard(notification))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Record Updates</h3>
                  <p className="text-gray-600 text-sm">
                    No health record updates
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Article Notifications */}
          <TabsContent value="articles" className="space-y-3">
            {articleNotifications.length > 0 ? (
              articleNotifications.map(notification => renderNotificationCard(notification))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No New Articles</h3>
                  <p className="text-gray-600 text-sm">
                    No new health articles available
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}