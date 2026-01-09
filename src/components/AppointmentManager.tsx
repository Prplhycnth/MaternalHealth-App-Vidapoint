import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Bell,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface AppointmentManagerProps {
  onBack: () => void;
  isFirstTimeUser?: boolean;
}

export function AppointmentManager({ onBack, isFirstTimeUser = false }: AppointmentManagerProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const upcomingAppointments = isFirstTimeUser ? [] : [
    {
      id: '1',
      date: '2025-01-29',
      time: '9:00 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 26 Prenatal Checkup',
      address: 'Malvar St, Puerto Princesa',
      phone: '+63 48 433 2156',
      notes: 'Regular prenatal checkup. Bring prenatal vitamins.',
      reminderSent: true,
      status: 'confirmed'
    }
  ];

  const missedAppointments = isFirstTimeUser ? [] : [
    {
      id: 'missed-1',
      date: '2025-01-10',
      time: '2:00 PM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 23 Follow-up Checkup',
      address: 'Malvar St, Puerto Princesa',
      phone: '+63 48 433 2156',
      status: 'missed',
      notes: 'Missed appointment - Please reschedule as soon as possible for continued prenatal care.',
      reason: 'Patient did not attend'
    }
  ];

  const pastAppointments = isFirstTimeUser ? [] : [
    {
      id: '2',
      date: '2025-01-15',
      time: '9:00 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 24 Prenatal Checkup',
      status: 'completed',
      notes: 'Regular prenatal checkup. Baby developing well. Fetal movements strong.'
    },
    {
      id: '3',
      date: '2025-01-01',
      time: '10:00 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 22 Prenatal Checkup',
      status: 'completed',
      notes: 'Glucose tolerance test scheduled. Ultrasound shows normal growth.'
    },
    {
      id: '4',
      date: '2024-12-18',
      time: '2:00 PM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 20 Anatomy Scan',
      status: 'completed',
      notes: 'Anatomy scan completed - all organs developing normally.'
    },
    {
      id: '5',
      date: '2024-12-04',
      time: '10:30 AM',
      doctor: 'Dr. Julian Montes',
      clinic: 'Montes Medical Clinic',
      type: 'Week 18 Prenatal Checkup',
      status: 'completed',
      notes: 'Mother reports feeling fetal movements. Baby active and healthy.'
    },
    {
      id: '6',
      date: '2024-11-20',
      time: '9:30 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 16 Prenatal Checkup',
      status: 'completed',
      notes: 'Second trimester progressing well. Energy levels improved.'
    },
    {
      id: '7',
      date: '2024-11-06',
      time: '2:00 PM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 14 Prenatal Checkup',
      status: 'completed',
      notes: 'Entering second trimester. Morning sickness subsiding.'
    },
    {
      id: '8',
      date: '2024-10-23',
      time: '9:00 AM',
      doctor: 'Dr. Julian Montes',
      clinic: 'Montes Medical Clinic',
      type: 'Week 12 First Trimester Screening',
      status: 'completed',
      notes: 'First trimester screening completed. NT scan normal.'
    },
    {
      id: '9',
      date: '2024-10-09',
      time: '3:00 PM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 10 Prenatal Checkup',
      status: 'completed',
      notes: 'Fetal heartbeat detected via Doppler. Blood work ordered.'
    },
    {
      id: '10',
      date: '2024-09-25',
      time: '10:00 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Week 8 First Ultrasound',
      status: 'completed',
      notes: 'First ultrasound performed. Gestational sac and fetal pole visible.'
    },
    {
      id: '11',
      date: '2024-09-11',
      time: '9:00 AM',
      doctor: 'Dr. Maria Santos',
      clinic: 'Puerto Princesa General Hospital',
      type: 'Initial Prenatal Visit',
      status: 'completed',
      notes: 'Pregnancy confirmed. Prenatal vitamins with folic acid prescribed.'
    }
  ];

  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ];

  const doctors = [
    { id: '1', name: 'Dr. Maria Santos', clinic: 'Puerto Princesa General Hospital' },
    { id: '2', name: 'Dr. Julian Montes', clinic: 'Montes Medical Clinic' },
    { id: '3', name: 'Dr. Ana Reyes', clinic: 'Adventist Hospital Palawan' }
  ];

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(doctors[0]?.id);

  // Mock booked appointments for prototype (keyed by doctor id)
  const mockBookedAppointments: Record<string, { date: string; bookedTimes: string[] }[]> = {
    '1': [
      { date: '2025-10-28', bookedTimes: ['9:00 AM', '10:30 AM', '2:00 PM'] },
      { date: '2025-10-30', bookedTimes: ['9:30 AM', '11:00 AM'] }
    ],
    '2': [
      { date: '2025-10-28', bookedTimes: ['9:30 AM', '3:00 PM'] }
    ]
  };

  const timeSlots = availableTimes;

  const getBookedTimes = (doctorId: string | undefined, date: Date | undefined) => {
    if (!doctorId || !date) return [] as string[];
    const day = date.toISOString().slice(0,10);
    const list = mockBookedAppointments[doctorId] || [];
    const entry = list.find((e) => e.date === day);
    return entry ? entry.bookedTimes : [];
  };

  

  if (showBookingForm) {
  // Use modal-style dialog similar to ClinicFinder
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const bookingClinic = { id: selectedDoctor?.id, name: selectedDoctor?.clinic || 'Clinic', address: '', hours: '24/7' };
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowBookingForm(false)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-medium">Book Appointment</h1>
                <p className="text-sm text-muted-foreground">Schedule your next visit</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
            <DialogContent className="w-[600px] max-w-[min(95vw,600px)] max-h-[80vh] flex flex-col rounded-lg">
              <DialogHeader>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogDescription>Schedule your visit to {bookingClinic.name}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 overflow-auto pr-2 flex-1">
                <Card className="p-3">
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Doctor</Label>
                      <Select value={selectedDoctorId} onValueChange={(v: string) => setSelectedDoctorId(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{d.name} — {d.clinic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Appointment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkup">Regular Checkup</SelectItem>
                          <SelectItem value="ultrasound">Ultrasound</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="lab">Laboratory Tests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Select Date</Label>
                      <Card className="p-3">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(d) => { setSelectedDate(d || undefined); setSelectedTime(undefined); }}
                          disabled={{ before: new Date() }}
                        />
                      </Card>
                    </div>

                    <div>
                      <Label>Available Time Slots</Label>
                      {selectedDate ? (
                        <div role="listbox" aria-label="Available time slots" className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time, i) => {
                            const isBooked = getBookedTimes(selectedDoctorId, selectedDate).includes(time);
                            const isSelected = selectedTime === time;
                            return (
                              <Tooltip key={time}>
                                <TooltipTrigger asChild>
                                  <Button
                                    role="option"
                                    aria-selected={isSelected}
                                    aria-disabled={isBooked}
                                    tabIndex={isBooked ? -1 : 0}
                                    variant={isSelected ? 'default' : 'outline'}
                                    className={`w-full justify-center flex items-center gap-2 ${isBooked ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                                    onClick={() => !isBooked && setSelectedTime(time)}
                                    disabled={isBooked}
                                  >
                                    <span className="text-sm">{time}</span>
                                    {isBooked && <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Booked</Badge>}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={6}>{isBooked ? `${time} — Booked` : `${time} — Available`}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ) : (
                        <Card className="p-4 text-center text-muted-foreground">
                          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Please select a date to see available times</p>
                        </Card>
                      )}
                    </div>

                    <div>
                      <Label>Additional Notes (Optional)</Label>
                      <Textarea placeholder="Any specific concerns or requirements..." className="h-20 resize-none" />
                    </div>
                  </CardContent>
                </Card>
              </div>

                  <DialogFooter className="flex space-x-2 bg-white border-t p-3">
                <Button variant="outline" onClick={() => setShowBookingForm(false)} className="flex-1">Cancel</Button>
                <Button onClick={() => {
                  if (!selectedDate || !selectedTime) {
                    toast.error('Please select a date and time before confirming.');
                    return;
                  }
                  const booked = getBookedTimes(selectedDoctorId, selectedDate);
                  if (booked.includes(selectedTime)) {
                    toast.error('Selected time is already booked. Please choose another slot.');
                    return;
                  }
                  toast.success('Appointment request sent! The clinic will contact you to confirm.');
                  setShowBookingForm(false);
                  setSelectedDate(undefined);
                  setSelectedTime(undefined);
                }} className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500">Book Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-medium">Appointments</h1>
              <p className="text-sm text-muted-foreground">Manage your visits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="missed">
              Missed
              {missedAppointments.length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs h-4 px-1.5">
                  {missedAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Next Appointments</h2>
              <Badge variant="secondary">{upcomingAppointments.length} scheduled</Badge>
            </div>

            {upcomingAppointments.map((appointment) => (
              <Card 
                key={appointment.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAppointment === appointment.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAppointment(
                  selectedAppointment === appointment.id ? null : appointment.id
                )}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      className={appointment.status === 'confirmed' ? 'bg-green-500' : ''}
                    >
                      {appointment.status === 'confirmed' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date} at {appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.clinic}</span>
                    </div>
                  </div>

                  {appointment.reminderSent && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
                      <Bell className="w-4 h-4" />
                      <span>Reminder sent</span>
                    </div>
                  )}

                  {selectedAppointment === appointment.id && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="text-sm">
                        <p className="font-medium mb-1">Location:</p>
                        <p className="text-gray-600">{appointment.address}</p>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium mb-1">Contact:</p>
                        <p className="text-gray-600">{appointment.phone}</p>
                      </div>

                      {appointment.notes && (
                        <div className="text-sm">
                          <p className="font-medium mb-1">Notes:</p>
                          <p className="text-gray-600">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {upcomingAppointments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600 text-sm mb-4">Schedule your next prenatal visit</p>
                  <Button 
                    className="bg-gradient-to-r from-pink-500 to-blue-500"
                    onClick={() => setShowBookingForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Missed Appointments */}
          <TabsContent value="missed" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Missed Appointments</h2>
              <Badge variant="secondary" className="bg-red-100 text-red-800">{missedAppointments.length} missed</Badge>
            </div>

            {missedAppointments.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Action Required</h3>
                    <p className="text-sm text-red-700 mt-1">
                      You have missed appointments. Please reschedule to ensure continuous prenatal care.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {missedAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date} at {appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.clinic}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="text-sm bg-red-50 border border-red-100 p-3 rounded-lg mb-3">
                      <p className="font-medium mb-1 text-red-900">Important:</p>
                      <p className="text-red-800">{appointment.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500"
                      onClick={() => setShowBookingForm(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Clinic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {missedAppointments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Missed Appointments</h3>
                  <p className="text-gray-600 text-sm">
                    Great job keeping up with your prenatal care!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Appointment History</h2>
              <Badge variant="secondary">{pastAppointments.length} visits</Badge>
            </div>

            {pastAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date} at {appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.clinic}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Visit Summary:</p>
                      <p className="text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}