import { useState } from 'react';
import { AuthScreen, SignUpData } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ClinicFinder } from './components/ClinicFinder';
import { HealthRecords } from './components/HealthRecords';
import { ArticlesSection } from './components/ArticlesSection';
import { AppointmentManager } from './components/AppointmentManager';
import { HealthRecordSharingNotifications } from './components/HealthRecordSharingNotifications';
import { HealthRecordSharing } from './components/HealthRecordSharing';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';

type Screen = 'auth' | 'dashboard' | 'clinics' | 'records' | 'articles' | 'appointments' | 'profile' | 'sharing-notifications' | 'health-record-sharing' | 'settings' | 'notifications';

// Mock user data for login
const mockLoginUser: SignUpData = {
  fullName: 'Maria Anne Gabuco',
  email: 'maria.gabuco@email.com',
  phone: '+63 912 345 6789',
  address: 'Barangay Bancao-Bancao, Puerto Princesa',
  dateOfBirth: '1995-03-15',
  isPregnant: true,
  lastMenstruationDate: '2025-01-15',
  hadPrenatalCheckup: true,
  previousCheckupLocation: 'Puerto Princesa General Hospital',
  height: '160',
  weight: '65',
  bloodType: 'O+',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [userData, setUserData] = useState<SignUpData | null>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const handleLogin = (signUpData?: SignUpData, isSignUp?: boolean) => {
    if (isSignUp && signUpData) {
      // Sign up - use the data they entered (first time user)
      setUserData(signUpData);
      setIsFirstTimeUser(true);
    } else {
      // Login - use mock data (returning user)
      setUserData(mockLoginUser);
      setIsFirstTimeUser(false);
    }
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setIsFirstTimeUser(false);
    setCurrentScreen('auth');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} userData={userData} isFirstTimeUser={isFirstTimeUser} />;
      case 'clinics':
        return <ClinicFinder onBack={handleBack} />;
      case 'records':
        return <HealthRecords onBack={handleBack} onNavigateToSharing={() => setCurrentScreen('health-record-sharing')} userData={userData} isFirstTimeUser={isFirstTimeUser} />;
      case 'articles':
        return <ArticlesSection onBack={handleBack} />;
      case 'appointments':
        return <AppointmentManager onBack={handleBack} isFirstTimeUser={isFirstTimeUser} />;
      case 'sharing-notifications':
        return <HealthRecordSharingNotifications onBack={handleBack} isFirstTimeUser={isFirstTimeUser} />;
      case 'health-record-sharing':
        return <HealthRecordSharing onBack={handleBack} />;
      case 'settings':
        return <Settings onBack={handleBack} onLogout={handleLogout} userData={userData} />;
      case 'notifications':
        return <Notifications onBack={handleBack} onNavigate={handleNavigate} isFirstTimeUser={isFirstTimeUser} />;
      case 'profile':
        return <Dashboard onNavigate={handleNavigate} userData={userData} isFirstTimeUser={isFirstTimeUser} />; // Placeholder for now
      default:
        return <Dashboard onNavigate={handleNavigate} userData={userData} isFirstTimeUser={isFirstTimeUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Container - iPhone 16 optimized */}
      <div className="mx-auto max-w-sm min-h-screen bg-white shadow-xl relative overflow-hidden">
        {/* Status Bar Safe Area */}
        <div className="h-12 bg-white"></div>
        
        {/* Main Content Area */}
        <div className="flex-1 relative">
          {renderScreen()}
        </div>
        
        {/* Bottom Safe Area for iPhone 16 home indicator */}
        <div className="h-8 bg-white"></div>
      </div>
    </div>
  );
}