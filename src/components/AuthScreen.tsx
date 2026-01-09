import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Check, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface AuthScreenProps {
  onLogin: (userData?: SignUpData, isSignUp?: boolean) => void;
}

export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  dateOfBirth: string;
  isPregnant: boolean;
  lastMenstruationDate?: string;
  doctorDueDate?: string;
  numberOfKids?: number;
  youngestChildDOB?: string;
  hadPrenatalCheckup: boolean;
  previousCheckupLocation?: string;
  height: string;
  weight: string;
  bloodType: string;
  isPhoneVerified: boolean;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP verification
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  // Terms & Conditions
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  
  // Pregnancy related
  const [isPregnant, setIsPregnant] = useState<string>('');
  const [dueDateMethod, setDueDateMethod] = useState<string>('menstruation');
  const [lastMenstruationDate, setLastMenstruationDate] = useState('');
  const [doctorDueDate, setDoctorDueDate] = useState('');
  
  // Non-pregnant related
  const [numberOfKids, setNumberOfKids] = useState('');
  const [youngestChildDOB, setYoungestChildDOB] = useState('');
  
  // Prenatal checkup
  const [hadPrenatalCheckup, setHadPrenatalCheckup] = useState<string>('');
  const [previousCheckupLocation, setPreviousCheckupLocation] = useState('');
  
  // Health info
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process with mock data
    setTimeout(() => {
      setIsLoading(false);
      onLogin(undefined, false); // Login with mock data
    }, 1500);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Require terms acceptance
    if (!termsAccepted) {
      toast.error('You must accept the Terms & Conditions to create an account.');
      setIsLoading(false);
      return;
    }
    
    // Validate phone verification
    if (!isPhoneVerified) {
      toast.error('Please verify your phone number before continuing');
      setIsLoading(false);
      return;
    }

    // Validate ID number
    if (!idNumber) {
      toast.error('Please enter a valid ID number');
      setIsLoading(false);
      return;
    }

    const userData: SignUpData = {
      fullName,
      email,
      phone,
      idNumber,
      address,
      dateOfBirth,
      isPregnant: isPregnant === 'yes',
      lastMenstruationDate: isPregnant === 'yes' && dueDateMethod === 'menstruation' ? lastMenstruationDate : undefined,
      doctorDueDate: isPregnant === 'yes' && dueDateMethod === 'doctor' ? doctorDueDate : undefined,
      numberOfKids: isPregnant === 'no' ? parseInt(numberOfKids) || 0 : undefined,
      youngestChildDOB: isPregnant === 'no' ? youngestChildDOB : undefined,
      hadPrenatalCheckup: hadPrenatalCheckup === 'yes',
      previousCheckupLocation: hadPrenatalCheckup === 'yes' ? previousCheckupLocation : undefined,
      height,
      weight,
      bloodType,
      isPhoneVerified: true
    };
    
    // Simulate signup process with user's entered data
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userData, true); // Sign up with user's data
    }, 1500);
  };

  return (<>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom overflow-y-auto">
      <Card className="w-full shadow-xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              VidaPoint
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your maternal health companion
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUpSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-700">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter your valid ID number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Please enter a government-issued ID number (e.g., SSS, UMID, Driver's License)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          disabled={isPhoneVerified}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`whitespace-nowrap ${isPhoneVerified ? 'bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600' : ''}`}
                        onClick={async () => {
                          if (isPhoneVerified) return;
                          setIsRequestingOtp(true);
                          // Simulate OTP request
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          toast.success('OTP sent to your phone number');
                          setIsRequestingOtp(false);
                        }}
                        disabled={!phone || isRequestingOtp || isPhoneVerified}
                      >
                        {isPhoneVerified ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Verified
                          </span>
                        ) : isRequestingOtp ? (
                          "Sending..."
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                  </div>

                  {phone && !isPhoneVerified && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={async () => {
                            setIsLoading(true);
                            // Simulate OTP verification
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            setIsPhoneVerified(true);
                            setOtpCode('');
                            toast.success('Phone number verified successfully');
                            setIsLoading(false);
                          }}
                          disabled={otpCode.length !== 6 || isLoading}
                        >
                          Verify
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Please enter the 6-digit code sent to your phone
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Address</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your barangay/city"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Pregnancy Status */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-gray-700">Pregnancy Status</h3>
                  
                  <div className="space-y-2">
                    <Label>Are you currently pregnant?</Label>
                    <RadioGroup value={isPregnant} onValueChange={setIsPregnant} required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pregnant-yes" />
                        <Label htmlFor="pregnant-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pregnant-no" />
                        <Label htmlFor="pregnant-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* If Pregnant */}
                  {isPregnant === 'yes' && (
                    <div className="space-y-3 pl-4 border-l-2 border-pink-300">
                      <div className="space-y-2">
                        <Label>How would you like to set your due date?</Label>
                        <RadioGroup value={dueDateMethod} onValueChange={setDueDateMethod}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="menstruation" id="method-menstruation" />
                            <Label htmlFor="method-menstruation" className="cursor-pointer">
                              Calculate from last menstruation
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="doctor" id="method-doctor" />
                            <Label htmlFor="method-doctor" className="cursor-pointer">
                              Estimated Due Date (as given by your doctor)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {dueDateMethod === 'menstruation' && (
                        <div className="space-y-2">
                          <Label htmlFor="lastMenstruation">First day of last menstruation</Label>
                          <Input
                            id="lastMenstruation"
                            type="date"
                            value={lastMenstruationDate}
                            onChange={(e) => setLastMenstruationDate(e.target.value)}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            We'll calculate your estimated due date
                          </p>
                        </div>
                      )}

                      {dueDateMethod === 'doctor' && (
                        <div className="space-y-2">
                          <Label htmlFor="doctorDueDate">Due date given by doctor</Label>
                          <Input
                            id="doctorDueDate"
                            type="date"
                            value={doctorDueDate}
                            onChange={(e) => setDoctorDueDate(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* If Not Pregnant */}
                  {isPregnant === 'no' && (
                    <div className="space-y-3 pl-4 border-l-2 border-blue-300">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfKids">How many children do you have?</Label>
                        <Input
                          id="numberOfKids"
                          type="number"
                          min="0"
                          placeholder="Number of children"
                          value={numberOfKids}
                          onChange={(e) => setNumberOfKids(e.target.value)}
                          required
                        />
                      </div>

                      {numberOfKids && parseInt(numberOfKids) > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="youngestDOB">Youngest child's date of birth</Label>
                          <Input
                            id="youngestDOB"
                            type="date"
                            value={youngestChildDOB}
                            onChange={(e) => setYoungestChildDOB(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Prenatal Checkup History */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-gray-700">Prenatal Care History</h3>
                  
                  <div className="space-y-2">
                    <Label>Have you had any prenatal check-ups?</Label>
                    <RadioGroup value={hadPrenatalCheckup} onValueChange={setHadPrenatalCheckup} required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="checkup-yes" />
                        <Label htmlFor="checkup-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="checkup-no" />
                        <Label htmlFor="checkup-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {hadPrenatalCheckup === 'yes' && (
                    <div className="space-y-2 pl-4 border-l-2 border-green-300">
                      <Label htmlFor="checkupLocation">Where did you conduct your previous prenatal check-up?</Label>
                      <Input
                        id="checkupLocation"
                        type="text"
                        placeholder="e.g., Puerto Princesa General Hospital"
                        value={previousCheckupLocation}
                        onChange={(e) => setPreviousCheckupLocation(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Health Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-sm text-gray-700">Health Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="e.g., 160"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 55"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your blood type" />
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
                </div>

                {/* Password */}
                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-start space-x-2 pt-3">
                  <Checkbox
                    checked={termsAccepted}
                    onCheckedChange={(v: any) => setTermsAccepted(Boolean(v))}
                    aria-label="Accept Terms and Conditions"
                  />
                  <div className="text-sm">
                    <label className="cursor-pointer">
                      I agree to the{' '}
                      <button type="button" className="text-primary underline" onClick={() => setShowTermsDialog(true)}>
                        Terms &amp; Conditions
                      </button>
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    
    {/* Terms & Conditions Dialog */}
    <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Terms & Conditions</DialogTitle>
          <DialogDescription>
            Please review the terms and conditions before creating an account.
          </DialogDescription>
        </DialogHeader>
        <div className="p-2 space-y-3 text-sm text-gray-700">
          <p><strong>1. Acceptance</strong> — By creating an account you agree to our terms and acknowledge that the information you provide is accurate.</p>
          <p><strong>2. Data use</strong> — We will use your contact information to send appointment reminders and other health-related notifications. We do not share your personal health data without consent.</p>
          <p><strong>3. Security</strong> — Keep your login credentials secure. Notify us if you suspect unauthorized access.</p>
          <p><strong>4. Prototype notice</strong> — This application is a prototype; some features may be simulated and not connected to live services.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTermsDialog(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>);
}
