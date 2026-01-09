import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Clock,
  Star,
  Map,
  Calendar,
  Building2,
  User
} from 'lucide-react';
import { PreciseMap } from './PreciseMap';
import { toast } from 'sonner@2.0.3';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { format } from 'date-fns';

interface ClinicFinderProps {
  onBack: () => void;
}

interface Clinic {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  waitTime: string;
  coordinates: { lat: number; lng: number };
}

export function ClinicFinder({ onBack }: ClinicFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingClinic, setBookingClinic] = useState<Clinic | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState<string | undefined>(undefined);

  // Mock booked appointments per clinic for prototype
  const mockBookedAppointments: Record<string, { date: string; bookedTimes: string[] }[]> = {
    '1': [
      { date: '2025-10-28', bookedTimes: ['9:00 AM', '10:30 AM', '2:00 PM'] },
      { date: '2025-10-29', bookedTimes: ['9:30 AM', '11:00 AM', '3:30 PM'] },
      { date: '2025-10-30', bookedTimes: ['10:00 AM', '2:30 PM', '4:00 PM'] },
    ],
    '2': [
      { date: '2025-10-28', bookedTimes: ['10:00 AM', '2:30 PM'] },
      { date: '2025-10-29', bookedTimes: ['9:00 AM', '3:00 PM'] },
    ],
    '3': [
      { date: '2025-10-28', bookedTimes: ['9:30 AM', '11:00 AM', '3:30 PM'] },
      { date: '2025-11-01', bookedTimes: ['10:00 AM', '2:30 PM'] },
    ],
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
  ];

  // Doctors affiliated with clinics (mock)
  const doctors = [
    { id: 'd1', name: 'Dr. Maria Santos', clinicId: '1' },
    { id: 'd2', name: 'Dr. Julian Montes', clinicId: '4' },
    { id: 'd3', name: 'Dr. Ana Reyes', clinicId: '3' }
  ];

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  // Map clinic services to appointment-type options
  const serviceToAppointmentType: Record<string, { value: string; label: string }> = {
    'Prenatal Care': { value: 'prenatal', label: 'Prenatal Checkup' },
    'Ultrasound': { value: 'ultrasound', label: 'Ultrasound' },
    'Consultation': { value: 'consultation', label: 'General Consultation' },
    'OB-GYN': { value: 'consultation', label: 'General Consultation' },
    'Laboratory': { value: 'laboratory', label: 'Laboratory Tests' },
    'Vaccination': { value: 'vaccination', label: 'Vaccination' },
    'Emergency': { value: 'emergency', label: 'Emergency' }
  };

  const getAvailableAppointmentTypesForClinic = (clinic: Clinic | null) => {
    if (!clinic || !clinic.services) return [] as { value: string; label: string }[];
    const mapped = clinic.services
      .map(s => serviceToAppointmentType[s])
      .filter(Boolean) as { value: string; label: string }[];
    // remove duplicates by value
    const unique: { value: string; label: string }[] = [];
    mapped.forEach(m => {
      if (!unique.find(u => u.value === m.value)) unique.push(m);
    });
    return unique;
  };

  // When bookingClinic changes, default to the first affiliated doctor (if any)
  useEffect(() => {
    if (!bookingClinic) {
      setSelectedDoctorId(undefined);
      setAppointmentType(undefined);
      return;
    }
    const affiliated = doctors.filter(d => d.clinicId === bookingClinic.id);
    setSelectedDoctorId(affiliated.length > 0 ? affiliated[0].id : undefined);

    const availableTypes = getAvailableAppointmentTypesForClinic(bookingClinic);
    setAppointmentType(availableTypes.length > 0 ? availableTypes[0].value : undefined);
  }, [bookingClinic]);

  // Mock booked appointments per doctor (prototype)
  const mockBookedAppointmentsByDoctor: Record<string, { date: string; bookedTimes: string[] }[]> = {
    'd1': [
      { date: '2025-10-28', bookedTimes: ['9:00 AM', '2:00 PM'] },
      { date: '2025-10-29', bookedTimes: ['10:30 AM'] },
    ],
    'd2': [
      { date: '2025-10-28', bookedTimes: ['10:00 AM'] },
      { date: '2025-10-30', bookedTimes: ['3:30 PM'] },
    ],
    'd3': [
      { date: '2025-10-28', bookedTimes: ['9:30 AM', '11:00 AM'] },
    ],
  };

  /**
   * Returns booked times for the selected date.
   * Priority: if a doctor is selected and there are doctor-specific bookings, use those;
   * otherwise fall back to clinic-level bookings for this prototype.
   */
  const getBookedTimes = (clinicId: string | undefined, date: Date | undefined) => {
    if (!clinicId || !date) return [] as string[];
    const dateStr = format(date, 'yyyy-MM-dd');

    // If a doctor is selected, prefer doctor-scoped bookings
    if (selectedDoctorId) {
      const doctorBookings = mockBookedAppointmentsByDoctor[selectedDoctorId] || [];
      const day = doctorBookings.find(d => d.date === dateStr);
      if (day) return day.bookedTimes;
    }

    // Fallback to clinic-level bookings
    const clinicBookings = mockBookedAppointments[clinicId] || [];
    const day = clinicBookings.find(d => d.date === dateStr);
    return day?.bookedTimes || [];
  };

  // keyboard navigation helper: focus slot by index
  const focusSlot = (index: number) => {
    const el = document.getElementById(`slot-${index}`) as HTMLElement | null;
    if (el) el.focus();
  };

  // User's current location (Puerto Princesa City)
  const userLocation = { lat: 9.7425, lng: 118.7398 };

  const clinics = [
    {
      id: '4',
      name: 'Montes Medical Clinic',
      type: 'Private Clinic',
      distance: '1.5 km',
      rating: 4.3,
      address: 'Rizal Ave, Puerto Princesa',
      phone: '+63 48 433 9876',
      hours: 'Mon-Sat 9AM-6PM',
      services: ['Prenatal Care', 'OB-GYN', 'Ultrasound'],
      waitTime: '20-45 mins',
      coordinates: { lat: 9.7380, lng: 118.7340 }
    },
    {
      id: '1',
      name: 'Puerto Princesa General Hospital',
      type: 'Hospital',
      distance: '2.3 km',
      rating: 4.5,
      address: 'Malvar St, Puerto Princesa',
      phone: '+63 48 433 2156',
      hours: '24/7',
      services: ['Prenatal Care', 'Vaccination', 'Laboratory'],
      waitTime: '15-30 mins',
      coordinates: { lat: 9.7392, lng: 118.7354 }
    },
    {
      id: '2',
      name: 'Bancao-Bancao Health Center',
      type: 'Health Center',
      distance: '0.8 km',
      rating: 4.2,
      address: 'Bancao-bancao, Puerto Princesa',
      phone: '+63 48 434 1234',
      hours: 'Mon-Fri 8AM-5PM',
      services: ['Prenatal Care', 'Vaccination', 'Consultation'],
      waitTime: '5-15 mins',
      coordinates: { lat: 9.7435, lng: 118.7410 }
    },
    {
      id: '3',
      name: 'Adventist Hospital Palawan',
      type: 'Private Hospital',
      distance: '3.1 km',
      rating: 4.7,
      address: 'San Pedro St, Puerto Princesa',
      phone: '+63 48 433 7777',
      hours: '24/7',
      services: ['Prenatal Care', 'Ultrasound', 'Vaccination'],
      waitTime: '10-20 mins',
      coordinates: { lat: 9.7455, lng: 118.7325 }
    },

    {
      id: '6',
      name: 'Palawan Medical City',
      type: 'Private Hospital',
      distance: '4.5 km',
      rating: 4.6,
      address: 'National Highway, Puerto Princesa',
      phone: '+63 48 433 8888',
      hours: '24/7',
      services: ['Prenatal Care', 'NICU', 'Vaccination', 'Laboratory'],
      waitTime: '20-35 mins',
      coordinates: { lat: 9.7320, lng: 118.7300 }
    }
  ];

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-medium">Find Clinics</h1>
              <p className="text-xs text-muted-foreground">Health centers near you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clinics, hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Mobile Content Container */}
      <div className="px-4 py-4 space-y-4 pb-20">

        {/* Mobile Map View Toggle */}
        <Card 
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0 cursor-pointer active:scale-95 transition-transform"
          onClick={() => setShowMapView(!showMapView)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">
                  {showMapView ? 'Show List View' : 'View on Map'}
                </h3>
                <p className="text-xs text-blue-100">
                  {showMapView ? 'Switch to list format' : 'See all locations visually'}
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ml-3">
                <Map className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Precise Interactive Map */}
        {showMapView && (
          <PreciseMap
            clinics={filteredClinics}
            selectedClinic={selectedClinic}
            onClinicSelect={setSelectedClinic}
            userLocation={userLocation}
          />
        )}

        {/* Mobile Clinic List */}
        {!showMapView && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Nearby Centers</h2>
              <span className="text-sm text-gray-500">({filteredClinics.length})</span>
            </div>
            
            {filteredClinics.map((clinic) => (
              <Card 
                key={clinic.id} 
                className={`cursor-pointer transition-all active:scale-98 ${
                  selectedClinic === clinic.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedClinic(clinic.id)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{clinic.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={clinic.type === 'Health Center' ? 'default' : 'secondary'}
                          className="text-xs h-5"
                        >
                          {clinic.type}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{clinic.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">{clinic.distance}</span>
                      <div className="text-xs text-gray-500 mt-0.5">{clinic.waitTime}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{clinic.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{clinic.hours}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {clinic.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs h-5 px-2">
                          {service}
                        </Badge>
                      ))}
                      {clinic.services.length > 3 && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          +{clinic.services.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-8 text-xs"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setBookingClinic(clinic);
                          setShowBookingDialog(true);
                        }}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Book appointment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          window.open(`tel:${clinic.phone}`);
                        }}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          // Open in maps app
                          window.open(`https://maps.google.com?q=${clinic.coordinates.lat},${clinic.coordinates.lng}`);
                        }}
                      >
                        <Navigation className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Mobile Empty State */}
        {!showMapView && filteredClinics.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No clinics found</h3>
              <p className="text-gray-600 text-sm">Try adjusting your search terms or check your location settings.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
  <DialogContent className="w-[600px] max-w-[min(95vw,600px)] max-h-[80vh] flex flex-col rounded-lg">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule your visit to {bookingClinic?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-auto pr-2 flex-1">
            {/* Clinic Info */}
            <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-3 border border-pink-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{bookingClinic?.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-muted-foreground truncate">{bookingClinic?.address}</p>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-muted-foreground">{bookingClinic?.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="doctorSelect">Doctor</Label>
              <Select value={selectedDoctorId} onValueChange={(v: string) => setSelectedDoctorId(v)}>
                <SelectTrigger id="doctorSelect" disabled={!bookingClinic || doctors.filter(d => d.clinicId === bookingClinic?.id).length === 0}>
                  <SelectValue placeholder={bookingClinic ? (doctors.filter(d => d.clinicId === bookingClinic.id).length ? 'Select a doctor' : 'No doctors available') : 'Select clinic first'} />
                </SelectTrigger>
                <SelectContent>
                  {doctors.filter(d => d.clinicId === bookingClinic?.id).map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label htmlFor="appointmentType">Appointment Type</Label>
              {
                (() => {
                  const availableAppointmentTypes = getAvailableAppointmentTypesForClinic(bookingClinic);
                  return (
                    <Select value={appointmentType} onValueChange={(v: string) => setAppointmentType(v)}>
                      <SelectTrigger id="appointmentType" disabled={!bookingClinic || availableAppointmentTypes.length === 0}>
                        <SelectValue placeholder={bookingClinic ? (availableAppointmentTypes.length ? 'Select appointment type' : 'No appointment types available') : 'Select clinic first'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAppointmentTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                })()
              }
            </div>

            {/* Calendar Date Picker */}
            <div className="space-y-2">
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

            {/* Available Time Slots */}
            <div className="space-y-2">
              <Label>Available Time Slots</Label>
              {selectedDate ? (
                <div
                  role="listbox"
                  aria-label="Available time slots"
                  className="grid grid-cols-2 gap-2"
                >
                  {timeSlots.map((time, i) => {
                    const isBooked = getBookedTimes(bookingClinic?.id, selectedDate).includes(time);
                    const isSelected = selectedTime === time;
                    const tooltipText = isBooked ? `${time} — Booked` : `${time} — Available`;
                    return (
                      <Tooltip key={time}>
                        <TooltipTrigger asChild>
                          <Button
                            id={`slot-${i}`}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={isBooked}
                            tabIndex={isBooked ? -1 : 0}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`w-full justify-center flex items-center gap-2 ${isBooked ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            onKeyDown={(e: any) => {
                              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                                e.preventDefault();
                                // move to next slot
                                let next = (i + 1) % timeSlots.length;
                                // skip booked slots
                                for (let k = 0; k < timeSlots.length; k++) {
                                  const idx = (next + k) % timeSlots.length;
                                  const t = timeSlots[idx];
                                  if (!getBookedTimes(bookingClinic?.id, selectedDate).includes(t)) {
                                    focusSlot(idx);
                                    break;
                                  }
                                }
                              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                                e.preventDefault();
                                let prev = (i - 1 + timeSlots.length) % timeSlots.length;
                                for (let k = 0; k < timeSlots.length; k++) {
                                  const idx = (prev - k + timeSlots.length) % timeSlots.length;
                                  const t = timeSlots[idx];
                                  if (!getBookedTimes(bookingClinic?.id, selectedDate).includes(t)) {
                                    focusSlot(idx);
                                    break;
                                  }
                                }
                              } else if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (!isBooked) setSelectedTime(time);
                              }
                            }}
                            disabled={isBooked}
                          >
                            <span className="text-sm">{time}</span>
                            {isBooked && <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Booked</Badge>}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={6}>{tooltipText}</TooltipContent>
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

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Any specific concerns or requirements..."
                className="h-20 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex space-x-2 bg-white border-t p-3">
            <Button 
              variant="outline" 
              onClick={() => setShowBookingDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Validate selection
                if (!selectedDate || !selectedTime) {
                  toast.error('Please select a date and time before confirming.');
                  return;
                }

                // If the clinic has affiliated doctors, ensure one is selected
                const affiliated = doctors.filter(d => d.clinicId === bookingClinic?.id);
                if (affiliated.length > 0 && !selectedDoctorId) {
                  toast.error('Please select a doctor for this clinic before confirming.');
                  return;
                }

                const booked = getBookedTimes(bookingClinic?.id, selectedDate);
                if (booked.includes(selectedTime)) {
                  toast.error('Selected time is already booked. Please choose another slot.');
                  return;
                }

                // Simulate booking (prototype)
                const doctorName = doctors.find(d => d.id === selectedDoctorId)?.name;
                toast.success(`Appointment request sent${doctorName ? ` with ${doctorName}` : ''}! The clinic will contact you to confirm.`);
                setShowBookingDialog(false);
                setBookingClinic(null);
                setSelectedDate(undefined);
                setSelectedTime(undefined);
              }}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}