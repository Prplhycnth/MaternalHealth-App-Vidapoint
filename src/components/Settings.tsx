import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SignUpData } from './AuthScreen';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Lock, 
  Mail,
  Heart,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onLogout?: () => void;
  userData: SignUpData | null;
}

// Calculate due date from last menstruation or use doctor's due date
const calculateDueDate = (userData: SignUpData | null): string => {
  if (!userData || !userData.isPregnant) return '';
  
  if (userData.doctorDueDate) {
    return userData.doctorDueDate;
  } else if (userData.lastMenstruationDate) {
    const lmpDate = new Date(userData.lastMenstruationDate);
    lmpDate.setDate(lmpDate.getDate() + 280); // Add 280 days (40 weeks)
    return lmpDate.toISOString().split('T')[0];
  }
  
  return '';
};

export function Settings({ onBack, onLogout, userData }: SettingsProps) {
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [healthTips, setHealthTips] = useState(true);
  const [recordSharingRequests, setRecordSharingRequests] = useState(true);

  // 🐞 Bug report feature states
  const [bugDescription, setBugDescription] = useState('');
  const [isReportingBug, setIsReportingBug] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      if (onLogout) {
        onLogout();
      }
    }
  };

  // 🧩 Function to handle bug report
  const handleBugReport = async () => {
    if (!bugDescription.trim()) {
      alert('Please describe the issue before submitting.');
      return;
    }

    try {
      setIsReportingBug(true);

      // Simulate sending report to admin (replace this with your backend API later)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Your bug report has been sent to the admin. Thank you!');
      setBugDescription('');
    } catch (error) {
      console.error('Error sending bug report:', error);
      alert('Failed to send bug report. Please try again later.');
    } finally {
      setIsReportingBug(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-medium">Settings</h1>
              <p className="text-xs text-muted-foreground">Manage your preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <Input id="name" defaultValue={userData?.fullName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue={userData?.dateOfBirth || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" defaultValue={userData?.email || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={userData?.phone || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm">Address</Label>
              <Input id="address" defaultValue={userData?.address || ''} />
            </div>
            <Button className="w-full" variant="outline">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm">Height (cm)</Label>
                <Input id="height" type="number" defaultValue={userData?.height || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm">Weight (kg)</Label>
                <Input id="weight" type="number" defaultValue={userData?.weight || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-sm">Blood Type</Label>
              <Select defaultValue={userData?.bloodType || 'O+'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {userData?.isPregnant && (
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm">Expected Due Date</Label>
                <Input id="dueDate" type="date" defaultValue={calculateDueDate(userData)} />
              </div>
            )}
            {!userData?.isPregnant && userData?.numberOfKids !== undefined && (
              <div className="space-y-2">
                <Label className="text-sm">Number of Children</Label>
                <Input type="number" defaultValue={userData.numberOfKids} />
              </div>
            )}
            <Button className="w-full" variant="outline">
              Update Health Info
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive appointment reminders via SMS</p>
              </div>
              <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Get health updates via email</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Appointment Reminders</Label>
                <p className="text-xs text-muted-foreground">Remind me before scheduled visits</p>
              </div>
              <Switch checked={appointmentReminders} onCheckedChange={setAppointmentReminders} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Health Tips</Label>
                <p className="text-xs text-muted-foreground">Receive pregnancy health tips</p>
              </div>
              <Switch checked={healthTips} onCheckedChange={setHealthTips} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Record Sharing Requests</Label>
                <p className="text-xs text-muted-foreground">Notify when health centers request records</p>
              </div>
              <Switch checked={recordSharingRequests} onCheckedChange={setRecordSharingRequests} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between h-auto py-3">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between h-auto py-3">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">Data Sharing Preferences</p>
                  <p className="text-xs text-muted-foreground">Manage health record sharing</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* 🐞 Report a Bug */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Report a Bug
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="bug-description" className="text-sm">Bug Description</Label>
              <Input
                id="bug-description"
                placeholder="Describe the issue you're experiencing..."
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleBugReport}
              disabled={isReportingBug}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isReportingBug ? 'Sending...' : 'Submit Bug Report'}
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          VidaPoint v1.0.0 • BSIT3-B3 Elective 3 Project
        </p>
      </div>
    </div>
  );
}
