import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ESignatureDialog } from './ESignatureDialog';
import { SignUpData } from './AuthScreen';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Activity, 
  Share,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Clock,
  Users,
  FileCheck
} from 'lucide-react';

interface HealthRecordsProps {
  onBack: () => void;
  onNavigateToSharing?: () => void;
  userData: SignUpData | null;
  isFirstTimeUser?: boolean;
}

// Calculate pregnancy week from last menstruation date or due date
const calculatePregnancyWeek = (userData: SignUpData | null): number => {
  if (!userData || !userData.isPregnant) return 0;
  
  const today = new Date();
  
  if (userData.lastMenstruationDate) {
    const lmpDate = new Date(userData.lastMenstruationDate);
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  } else if (userData.doctorDueDate) {
    const dueDate = new Date(userData.doctorDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.floor(diffDays / 7);
    return 40 - weeksRemaining;
  }
  
  return 24;
};

// Get trimester based on week
const getTrimester = (week: number): string => {
  if (week <= 13) return 'First Trimester';
  if (week <= 26) return 'Second Trimester';
  return 'Third Trimester';
};

export function HealthRecords({ onBack, onNavigateToSharing, userData, isFirstTimeUser = false }: HealthRecordsProps) {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sharingStep, setSharingStep] = useState(1);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  
  // Sharing form state
  const [sharingPurpose, setSharingPurpose] = useState('');
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState('');
  const [accessDuration, setAccessDuration] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  
  const pregnancyWeek = calculatePregnancyWeek(userData);
  const trimester = getTrimester(pregnancyWeek);

  const prenatalRecords = isFirstTimeUser ? [] : [
    {
      id: '1',
      date: '2025-01-15',
      week: 24,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '65 kg',
      height: '150 cm',
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      fetalHeartRate: '145 bpm',
      fundalHeight: '24 cm',
      notes: 'Regular prenatal checkup. Baby developing well. Fetal movements strong and regular. No complications. Continue prenatal vitamins.',
      nextAppointment: '2025-01-29',
      status: 'completed'
    },
    {
      id: '2',
      date: '2025-01-01',
      week: 22,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '63 kg',
      height: '150 cm',
      bloodPressure: '118/78',
      heartRate: '70 bpm',
      fetalHeartRate: '142 bpm',
      fundalHeight: '22 cm',
      notes: 'Glucose tolerance test scheduled. Ultrasound shows normal growth and development. Baby moving actively. Advised on nutrition and exercise.',
      nextAppointment: '2025-01-15',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-12-18',
      week: 20,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '61 kg',
      height: '150 cm',
      bloodPressure: '115/75',
      heartRate: '68 bpm',
      fetalHeartRate: '140 bpm',
      fundalHeight: '20 cm',
      notes: 'Anatomy scan completed - all organs developing normally. Gender revealed if desired. Fetal measurements appropriate for gestational age. No abnormalities detected.',
      nextAppointment: '2025-01-01',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-12-04',
      week: 18,
      doctor: 'Dr. Julian Montes',
      clinic: 'Montes Medical Clinic',
      weight: '59 kg',
      height: '150 cm',
      bloodPressure: '112/74',
      heartRate: '68 bpm',
      fetalHeartRate: '138 bpm',
      fundalHeight: '18 cm',
      notes: 'Mother reports feeling fetal movements (quickening). Baby active and healthy. Recommended anatomy scan at 20 weeks. Iron supplements prescribed.',
      nextAppointment: '2024-12-18',
      status: 'completed'
    },
    {
      id: '5',
      date: '2024-11-20',
      week: 16,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '57.5 kg',
      height: '150 cm',
      bloodPressure: '110/72',
      heartRate: '66 bpm',
      fetalHeartRate: '145 bpm',
      fundalHeight: '16 cm',
      notes: 'Second trimester progressing well. Energy levels improved. No morning sickness. Discussed prenatal screening options. Continue current supplements.',
      nextAppointment: '2024-12-04',
      status: 'completed'
    },
    {
      id: '6',
      date: '2024-11-06',
      week: 14,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '56 kg',
      bloodPressure: '108/70',
      heartRate: '65 bpm',
      fetalHeartRate: '150 bpm',
      fundalHeight: '14 cm',
      notes: 'Entering second trimester. Morning sickness subsiding. Fetal heartbeat strong and regular. All vital signs normal. Discussed nutrition and weight gain.',
      nextAppointment: '2024-11-20',
      status: 'completed'
    },
    {
      id: '7',
      date: '2024-10-23',
      week: 12,
      doctor: 'Dr. Julian Montes',
      clinic: 'Montes Medical Clinic',
      weight: '55 kg',
      height: '150 cm',
      bloodPressure: '110/70',
      heartRate: '64 bpm',
      fetalHeartRate: '155 bpm',
      fundalHeight: '12 cm',
      notes: 'First trimester screening completed. NT scan normal. Risk assessment low. Baby measuring on track. Discussed prenatal vitamins and diet.',
      nextAppointment: '2024-11-06',
      status: 'completed'
    },
    {
      id: '8',
      date: '2024-10-09',
      week: 10,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '54.5 kg',
      height: '150 cm',
      bloodPressure: '108/68',
      heartRate: '64 bpm',
      fetalHeartRate: '160 bpm',
      notes: 'Fetal heartbeat detected via Doppler. Morning sickness still present but manageable. Advised on anti-nausea measures. Blood work ordered.',
      nextAppointment: '2024-10-23',
      status: 'completed'
    },
    {
      id: '9',
      date: '2024-09-25',
      week: 8,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '54 kg',
      height: '150 cm',
      bloodPressure: '105/65',
      heartRate: '62 bpm',
      notes: 'First ultrasound performed. Gestational sac and fetal pole visible. Crown-rump length measured. Due date confirmed. Experiencing morning sickness - normal.',
      nextAppointment: '2024-10-09',
      status: 'completed'
    },
    {
      id: '10',
      date: '2024-09-11',
      week: 6,
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      weight: '53.5 kg',
      height: '150 cm',
      bloodPressure: '110/70',
      heartRate: '60 bpm',
      notes: 'Initial prenatal visit. Pregnancy confirmed. Medical history reviewed. Prenatal vitamins with folic acid prescribed. Discussed lifestyle modifications and warning signs.',
      nextAppointment: '2024-09-25',
      status: 'completed'
    }
  ];

  const labResults = isFirstTimeUser ? [] : [
    {
      id: '1',
      date: '2025-01-15',
      test: 'Complete Blood Count (24 weeks)',
      result: 'Normal',
      status: 'normal',
      values: {
        'Hemoglobin': '12.5 g/dL',
        'Hematocrit': '37.5%',
        'White Blood Cells': '9,200/μL',
        'Platelets': '245,000/μL',
        'Red Blood Cells': '4.2 million/μL'
      }
    },
    {
      id: '2',
      date: '2025-01-05',
      test: 'Glucose Tolerance Test (GTT)',
      result: 'Normal - No Gestational Diabetes',
      status: 'normal',
      values: {
        'Fasting': '82 mg/dL',
        '1 Hour': '138 mg/dL',
        '2 Hour': '118 mg/dL',
        '3 Hour': '95 mg/dL'
      }
    },
    {
      id: '3',
      date: '2024-12-18',
      test: 'Urinalysis (20 weeks)',
      result: 'Normal',
      status: 'normal',
      values: {
        'Protein': 'Negative',
        'Glucose': 'Negative',
        'Bacteria': 'Negative',
        'pH': '6.0',
        'Ketones': 'Negative'
      }
    },
    {
      id: '4',
      date: '2024-11-06',
      test: 'Complete Blood Count (14 weeks)',
      result: 'Normal',
      status: 'normal',
      values: {
        'Hemoglobin': '12.8 g/dL',
        'Hematocrit': '38%',
        'White Blood Cells': '8,500/μL',
        'Platelets': '260,000/μL',
        'Red Blood Cells': '4.3 million/μL'
      }
    },
    {
      id: '5',
      date: '2024-10-23',
      test: 'First Trimester Screening',
      result: 'Low Risk',
      status: 'normal',
      values: {
        'NT Measurement': '1.2 mm',
        'PAPP-A': 'Normal',
        'Free Beta hCG': 'Normal',
        'Risk for Trisomy 21': '1:10,000',
        'Risk for Trisomy 18': '1:10,000'
      }
    },
    {
      id: '6',
      date: '2024-10-09',
      test: 'Thyroid Function Test',
      result: 'Normal',
      status: 'normal',
      values: {
        'TSH': '1.8 mIU/L',
        'Free T4': '1.2 ng/dL',
        'Free T3': '3.1 pg/mL'
      }
    },
    {
      id: '7',
      date: '2024-09-25',
      test: 'Blood Type and Rh Factor',
      result: 'O Positive',
      status: 'normal',
      values: {
        'Blood Type': 'O',
        'Rh Factor': 'Positive',
        'Antibody Screen': 'Negative'
      }
    },
    {
      id: '8',
      date: '2024-09-11',
      test: 'Initial Prenatal Panel',
      result: 'Normal',
      status: 'normal',
      values: {
        'Hemoglobin': '13.2 g/dL',
        'Hematocrit': '39%',
        'Rubella Immunity': 'Immune',
        'Hepatitis B': 'Negative',
        'HIV': 'Negative',
        'Syphilis': 'Negative'
      }
    },
    {
      id: '9',
      date: '2024-09-11',
      test: 'Urinalysis (Initial)',
      result: 'Normal',
      status: 'normal',
      values: {
        'Protein': 'Negative',
        'Glucose': 'Negative',
        'Bacteria': 'Negative',
        'WBC': 'Negative',
        'pH': '5.8'
      }
    },
    {
      id: '10',
      date: '2024-09-11',
      test: 'Urine Culture',
      result: 'No Growth',
      status: 'normal',
      values: {
        'Culture': 'No bacterial growth',
        'Colony Count': '<10,000 CFU/mL'
      }
    }
  ];

  const vaccinations = isFirstTimeUser ? [] : [
    {
      id: '1',
      vaccine: 'Tetanus Toxoid (TT) - Booster',
      date: '2024-12-04',
      dose: '2nd dose',
      nextDue: '2025-05-04',
      lotNumber: 'TT-2024-1234',
      administeredBy: 'Nurse Garcia, RN',
      site: 'Left deltoid',
      status: 'completed'
    },
    {
      id: '2',
      vaccine: 'Tetanus Toxoid (TT)',
      date: '2024-09-25',
      dose: '1st dose',
      nextDue: '2024-12-04',
      lotNumber: 'TT-2024-0987',
      administeredBy: 'Nurse Reyes, RN',
      site: 'Left deltoid',
      status: 'completed'
    },
    {
      id: '3',
      vaccine: 'Influenza (Flu Shot)',
      date: '2024-11-06',
      dose: 'Annual dose',
      nextDue: '2025-11-06',
      lotNumber: 'FLU-2024-5678',
      administeredBy: 'Nurse Garcia, RN',
      site: 'Right deltoid',
      status: 'completed'
    },
    {
      id: '4',
      vaccine: 'Tdap (Whooping Cough)',
      date: '2024-12-18',
      dose: 'Single dose',
      nextDue: 'Next pregnancy',
      lotNumber: 'TDAP-2024-3456',
      administeredBy: 'Nurse Santos, RN',
      site: 'Left deltoid',
      notes: 'Recommended between 27-36 weeks to protect newborn',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-medium">Health Records</h1>
                <p className="text-xs text-muted-foreground">Your medical history</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10"
                onClick={() => setShowShareDialog(true)}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{userData?.fullName || 'User'}</h3>
                <p className="text-pink-100">
                  {userData?.isPregnant 
                    ? `Week ${pregnancyWeek} • ${trimester}`
                    : 'Health Records'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium">{userData?.weight || '0'}kg</div>
                <div className="text-pink-100 text-sm">Current Weight</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-pink-100">Blood Type</div>
                <div className="font-medium">{userData?.bloodType || 'N/A'}</div>
              </div>
              <div>
                <div className="text-pink-100">Height</div>
                <div className="font-medium">{userData?.height || '0'} cm</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="prenatal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prenatal">Prenatal</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
          </TabsList>

          {/* Prenatal Records */}
          <TabsContent value="prenatal" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Prenatal Visits</h2>
              <Badge variant="secondary">{prenatalRecords.length} visits</Badge>
            </div>
            
            {prenatalRecords.map((record) => (
              <Card 
                key={record.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRecord === record.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Week {record.week} Check-up</h3>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {record.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{record.doctor} • {record.clinic}</p>
                  </div>

                  {selectedRecord === record.id && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="ml-2 font-medium">{record.weight}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Height:</span>
                          <span className="ml-2 font-medium">{record.height}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">BP:</span>
                          <span className="ml-2 font-medium">{record.bloodPressure}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Heart Rate:</span>
                          <span className="ml-2 font-medium">{record.heartRate}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>Next appointment: {record.nextAppointment}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Lab Results */}
          <TabsContent value="lab" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Laboratory Results</h2>
              <Badge variant="secondary">{labResults.length} tests</Badge>
            </div>
            
            {labResults.map((lab) => (
              <Card 
                key={lab.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRecord === lab.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRecord(selectedRecord === lab.id ? null : lab.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{lab.test}</h3>
                      <p className="text-sm text-muted-foreground">{lab.date}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={lab.status === 'normal' ? 'text-green-600 border-green-600' : 'text-orange-600 border-orange-600'}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {lab.result}
                    </Badge>
                  </div>

                  {selectedRecord === lab.id && (
                    <div className="mt-4 space-y-2 border-t pt-3">
                      <h4 className="font-medium text-sm">Test Values:</h4>
                      {Object.entries(lab.values).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Vaccinations */}
          <TabsContent value="vaccines" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Vaccination Records</h2>
              <Badge variant="secondary">{vaccinations.length} vaccines</Badge>
            </div>
            
            {vaccinations.map((vaccine) => (
              <Card key={vaccine.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{vaccine.vaccine}</h3>
                      <p className="text-sm text-muted-foreground">{vaccine.dose}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {vaccine.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Given:</span>
                      <span className="ml-2 font-medium">{vaccine.date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next due:</span>
                      <span className="ml-2 font-medium">{vaccine.nextDue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Comprehensive Sharing Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share className="w-5 h-5 text-blue-500" />
              <span>Share Health Records</span>
            </DialogTitle>
            <DialogDescription>
              Step {sharingStep} of 4 - Control your health data sharing
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Purpose and Record Selection */}
          {sharingStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <FileCheck className="w-5 h-5" />
                  <h3 className="font-medium">Purpose & Records to Share</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select which records you want to share and why
                </p>
              </div>

              {/* Facility Selection */}
              <div className="space-y-2">
                <Label htmlFor="facility">Healthcare Facility *</Label>
                <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                  <SelectTrigger id="facility">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppgh">Puerto Princesa General Hospital</SelectItem>
                    <SelectItem value="maternal">Montes Medical Clinic</SelectItem>
                    <SelectItem value="adventist">Adventist Hospital Palawan</SelectItem>
                    <SelectItem value="palawan-medical">Palawan Medical City</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Purpose Selection */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Sharing *</Label>
                <Select value={sharingPurpose} onValueChange={setSharingPurpose}>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prenatal">Prenatal Care Continuity</SelectItem>
                    <SelectItem value="emergency">Emergency Medical Care</SelectItem>
                    <SelectItem value="referral">Medical Referral</SelectItem>
                    <SelectItem value="second-opinion">Second Opinion</SelectItem>
                    <SelectItem value="specialist">Specialist Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Record Type Selection */}
              <div className="space-y-3">
                <Label>Select Records to Share *</Label>
                <div className="space-y-2 border rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="prenatal" 
                      checked={selectedRecordTypes.includes('prenatal')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecordTypes([...selectedRecordTypes, 'prenatal']);
                        } else {
                          setSelectedRecordTypes(selectedRecordTypes.filter(t => t !== 'prenatal'));
                        }
                      }}
                    />
                    <label htmlFor="prenatal" className="text-sm cursor-pointer">
                      Prenatal Checkup Records ({prenatalRecords.length} records)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lab" 
                      checked={selectedRecordTypes.includes('lab')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecordTypes([...selectedRecordTypes, 'lab']);
                        } else {
                          setSelectedRecordTypes(selectedRecordTypes.filter(t => t !== 'lab'));
                        }
                      }}
                    />
                    <label htmlFor="lab" className="text-sm cursor-pointer">
                      Laboratory Results ({labResults.length} tests)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vaccines" 
                      checked={selectedRecordTypes.includes('vaccines')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecordTypes([...selectedRecordTypes, 'vaccines']);
                        } else {
                          setSelectedRecordTypes(selectedRecordTypes.filter(t => t !== 'vaccines'));
                        }
                      }}
                    />
                    <label htmlFor="vaccines" className="text-sm cursor-pointer">
                      Vaccination Records ({vaccinations.length} vaccines)
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setSharingStep(2)}
                  disabled={!selectedFacility || !sharingPurpose || selectedRecordTypes.length === 0}
                  className="bg-gradient-to-r from-pink-500 to-blue-500"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Access Permission */}
          {sharingStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Users className="w-5 h-5" />
                  <h3 className="font-medium">Access Permission</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control who at the facility can view your records
                </p>
              </div>

              <RadioGroup value={accessLevel} onValueChange={setAccessLevel}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="attending-only" id="attending-only" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="attending-only" className="cursor-pointer font-medium">
                        Attending Physician Only
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Only the doctor directly responsible for your care
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="medical-team" id="medical-team" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="medical-team" className="cursor-pointer font-medium">
                        Medical Team
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Doctors, nurses, and medical staff involved in your care
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="authorized-staff" id="authorized-staff" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="authorized-staff" className="cursor-pointer font-medium">
                        All Authorized Staff
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        All licensed healthcare professionals at the facility
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-between space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSharingStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  onClick={() => setSharingStep(3)}
                  disabled={!accessLevel}
                  className="bg-gradient-to-r from-pink-500 to-blue-500"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Access Duration */}
          {sharingStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-medium">Access Duration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set how long the facility can access your records
                </p>
              </div>

              <RadioGroup value={accessDuration} onValueChange={setAccessDuration}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="single-visit" id="single-visit" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="single-visit" className="cursor-pointer font-medium">
                        Single Visit Only
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Access expires after one appointment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="7-days" id="7-days" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="7-days" className="cursor-pointer font-medium">
                        7 Days
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Access expires in one week
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="30-days" id="30-days" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="30-days" className="cursor-pointer font-medium">
                        30 Days
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Access expires in one month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="pregnancy-duration" id="pregnancy-duration" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pregnancy-duration" className="cursor-pointer font-medium">
                        Duration of Pregnancy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Access until your due date
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="until-revoked" id="until-revoked" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="until-revoked" className="cursor-pointer font-medium">
                        Until I Revoke Access
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Access continues until you manually revoke it
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-between space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSharingStep(2)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  onClick={() => setSharingStep(4)}
                  disabled={!accessDuration}
                  className="bg-gradient-to-r from-pink-500 to-blue-500"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation and Consent */}
          {sharingStep === 4 && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-medium">Confirmation & Consent</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review your sharing settings before submitting
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-4 space-y-3 border border-pink-200">
                <div>
                  <span className="text-sm text-muted-foreground">Sharing with:</span>
                  <p className="font-medium">
                    {selectedFacility === 'ppgh' && 'Puerto Princesa General Hospital'}
                    {selectedFacility === 'maternal' && 'Montes Medical Clinic'}
                    {selectedFacility === 'adventist' && 'Adventist Hospital Palawan'}
                    {selectedFacility === 'palawan-medical' && 'Palawan Medical City'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Purpose:</span>
                  <p className="font-medium">
                    {sharingPurpose === 'prenatal' && 'Prenatal Care Continuity'}
                    {sharingPurpose === 'emergency' && 'Emergency Medical Care'}
                    {sharingPurpose === 'referral' && 'Medical Referral'}
                    {sharingPurpose === 'second-opinion' && 'Second Opinion'}
                    {sharingPurpose === 'specialist' && 'Specialist Consultation'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Records:</span>
                  <p className="font-medium">
                    {selectedRecordTypes.includes('prenatal') && 'Prenatal Records, '}
                    {selectedRecordTypes.includes('lab') && 'Lab Results, '}
                    {selectedRecordTypes.includes('vaccines') && 'Vaccinations'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Access Level:</span>
                  <p className="font-medium">
                    {accessLevel === 'attending-only' && 'Attending Physician Only'}
                    {accessLevel === 'medical-team' && 'Medical Team'}
                    {accessLevel === 'authorized-staff' && 'All Authorized Staff'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {accessDuration === 'single-visit' && 'Single Visit Only'}
                    {accessDuration === '7-days' && '7 Days'}
                    {accessDuration === '30-days' && '30 Days'}
                    {accessDuration === 'pregnancy-duration' && 'Duration of Pregnancy'}
                    {accessDuration === 'until-revoked' && 'Until Revoked'}
                  </p>
                </div>
              </div>

              {/* Legal Consent Text */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-medium mb-2">Legal and Ethical Safeguard</p>
                    <p className="leading-relaxed">
                      I understand that by sharing my health record, I am authorizing the selected facility to view only the data I have chosen, for the specified duration and purpose. I can revoke this access anytime through the app settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSharingStep(3)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  onClick={() => {
                    setShowShareDialog(false);
                    setShowSignatureDialog(true);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-blue-500"
                >
                  Proceed to Sign <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        isOpen={showSignatureDialog}
        onClose={() => {
          setShowSignatureDialog(false);
          setSharingStep(1);
          setSelectedRecordTypes([]);
          setSharingPurpose('');
          setAccessLevel('');
          setAccessDuration('');
          setSelectedFacility('');
        }}
        onComplete={() => {
          setShowSignatureDialog(false);
          setSharingStep(1);
          setSelectedRecordTypes([]);
          setSharingPurpose('');
          setAccessLevel('');
          setAccessDuration('');
          setSelectedFacility('');
          toast.success('Health records shared successfully!');
          if (onNavigateToSharing) {
            onNavigateToSharing();
          }
        }}
        facilityName={
          selectedFacility === 'ppgh' ? 'Puerto Princesa General Hospital' :
          selectedFacility === 'maternal' ? 'Montes Medical Clinic' :
          selectedFacility === 'adventist' ? 'Adventist Hospital Palawan' :
          selectedFacility === 'palawan-medical' ? 'Palawan Medical City' :
          'Selected Healthcare Facility'
        }
      />
    </div>
  );
}