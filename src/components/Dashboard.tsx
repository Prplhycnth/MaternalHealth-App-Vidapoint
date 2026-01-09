import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { SignUpData } from './AuthScreen';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  FileText, 
  BookOpen, 
  Bell, 
  Settings,
  Clock,
  User,
  Share2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FloatingActionButton } from './FloatingActionButton';
import { NotificationOverlay } from './NotificationOverlay';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  userData: SignUpData | null;
  isFirstTimeUser?: boolean;
}

// Calculate pregnancy week from estimated conception date (derived from due date) or LMP
// Conception is assumed to be 280 days (40 weeks) before the estimated due date.
// Pregnancy week is number of full weeks since conception, capped to [0, 40].
const calculatePregnancyWeek = (userData: SignUpData | null): number => {
  if (!userData || !userData.isPregnant) return 0;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const MS_PER_WEEK = MS_PER_DAY * 7;
  const today = new Date();

  // If doctor-provided due date exists, derive conception date = dueDate - 280 days
  if (userData.doctorDueDate) {
    const due = new Date(userData.doctorDueDate);
    if (!isNaN(due.getTime())) {
      const conceptionMs = due.getTime() - 280 * MS_PER_DAY;
      const diffMs = today.getTime() - conceptionMs;
      let weeks = Math.floor(diffMs / MS_PER_WEEK);
      if (weeks < 0) weeks = 0;
      if (weeks > 40) weeks = 40;
      return weeks;
    }
  }

  // Fallback: calculate from last menstruation date (LMP)
  if (userData.lastMenstruationDate) {
    const lmp = new Date(userData.lastMenstruationDate);
    if (!isNaN(lmp.getTime())) {
      const diffMs = today.getTime() - lmp.getTime();
      let weeks = Math.floor(diffMs / MS_PER_WEEK);
      if (weeks < 0) weeks = 0;
      if (weeks > 40) weeks = 40;
      return weeks;
    }
  }

  // Default to 0 if no valid dates
  return 0;
};

// Get trimester based on week
const getTrimester = (week: number): string => {
  if (week <= 13) return 'First Trimester';
  if (week <= 26) return 'Second Trimester';
  return 'Third Trimester';
};

// Get first name from full name
const getFirstName = (fullName: string): string => {
  return fullName.split(' ')[0];
};

export function Dashboard({ onNavigate, userData, isFirstTimeUser = false }: DashboardProps) {
  const userName = userData ? getFirstName(userData.fullName) : "User";
  const pregnancyWeek = calculatePregnancyWeek(userData);
  const trimester = getTrimester(pregnancyWeek);
  const [nextAppointment] = useState(isFirstTimeUser ? "No upcoming appointments" : "Tomorrow, 2:00 PM");
  const [pendingSharingRequests] = useState(isFirstTimeUser ? 0 : 1);
  const [isNotificationOverlayOpen, setIsNotificationOverlayOpen] = useState(false);

  const dashboardCards = [
    {
      id: 'records',
      title: 'Health Records',
      description: 'View your medical history',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      onClick: () => onNavigate('records')
    },
    {
      id: 'clinics',
      title: 'Find Clinic',
      description: 'Locate nearby health centers',
      icon: MapPin,
      color: 'from-green-500 to-green-600',
      onClick: () => onNavigate('clinics')
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Manage your check-ups',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      onClick: () => onNavigate('appointments')
    },
    {
      id: 'articles',
      title: 'Health Articles',
      description: 'Pregnancy tips & guides',
      icon: BookOpen,
      color: 'from-pink-500 to-pink-600',
      onClick: () => onNavigate('articles')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-medium">VidaPoint</h1>
                <p className="text-sm text-muted-foreground">Hello, {userName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="w-5 h-5" />
                {pendingSharingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingSharingRequests}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10"
                onClick={() => onNavigate('settings')}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {/* Mobile Pregnancy Status Card */}
        {userData?.isPregnant && (
          <Card className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">Week {pregnancyWeek}</h3>
                  <p className="text-sm text-pink-100">{trimester}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2.5">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">Next appointment: {nextAppointment}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!userData?.isPregnant && userData && (
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">Health Tracking</h3>
                  <p className="text-sm text-purple-100">
                    {userData.numberOfKids ? `${userData.numberOfKids} ${userData.numberOfKids === 1 ? 'child' : 'children'}` : 'Maternal Health Records'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-2.5">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">Next appointment: {nextAppointment}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Quick Actions */}
        <div>
          <h2 className="font-medium mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={card.id}
                  className="cursor-pointer transition-all active:scale-95 hover:shadow-md"
                  onClick={card.onClick}
                >
                  <CardContent className="p-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-medium mb-1 text-sm leading-tight">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Health Record Sharing Notifications */}
        {pendingSharingRequests > 0 && (
          <Card 
            className="border-orange-200 bg-orange-50 cursor-pointer transition-all active:scale-95"
            onClick={() => onNavigate('health-record-sharing')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-orange-800">Health Record Sharing</h3>
                  <p className="text-sm text-orange-600">
                    {pendingSharingRequests} healthcare facilities requesting access
                  </p>
                </div>
                <Badge className="bg-orange-500 text-white text-xs">
                  {pendingSharingRequests} pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile Recent Activity */}
        <div>
          <h2 className="font-medium mb-3">Recent Activity</h2>
          <Card>
            <CardContent className="p-3 space-y-3">
              {isFirstTimeUser ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Welcome to VidaPoint!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your maternal health journey starts here. Book your first appointment or explore nearby health centers.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                      onClick={() => onNavigate('clinics')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Find Health Centers
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('appointments')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Appointment booked</p>
                      <p className="text-xs text-muted-foreground">Dr. Santos - Tomorrow 2:00 PM</p>
                    </div>
                    <Badge variant="secondary" className="text-xs h-5">New</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Health record updated</p>
                      <p className="text-xs text-muted-foreground">Blood pressure check - 2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New article available</p>
                      <p className="text-xs text-muted-foreground">"Second Trimester Care" - 3 days ago</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>


      </div>

      {/* Floating Action Button for Sharing Requests */}
      <FloatingActionButton 
        pendingCount={pendingSharingRequests}
        onNavigateToSharing={() => onNavigate('health-record-sharing')}
      />

      {/* Notification Overlay */}
      <NotificationOverlay 
        isOpen={isNotificationOverlayOpen}
        onClose={() => setIsNotificationOverlayOpen(false)}
        onNavigateToSharing={() => onNavigate('health-record-sharing')}
        pendingSharingRequests={pendingSharingRequests}
      />
    </div>
  );
}