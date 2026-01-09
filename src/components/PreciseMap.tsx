import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Calendar,
  Star,
  Locate,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

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

interface PreciseMapProps {
  clinics: Clinic[];
  selectedClinic: string | null;
  onClinicSelect: (clinicId: string) => void;
  userLocation?: { lat: number; lng: number };
}

export function PreciseMap({ clinics, selectedClinic, onClinicSelect, userLocation }: PreciseMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [centerPosition, setCenterPosition] = useState({ lat: 9.7392, lng: 118.7354 });
  const [showRoutes, setShowRoutes] = useState(false);

  // Puerto Princesa City bounds for mapping
  const mapBounds = {
    north: 9.76,
    south: 9.72,
    east: 118.76,
    west: 118.72
  };

  // Convert lat/lng to pixel coordinates
  const coordsToPixels = (lat: number, lng: number) => {
    const mapWidth = 320; // Map container width
    const mapHeight = 240; // Map container height
    
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * mapWidth;
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * mapHeight;
    
    return { x: Math.max(0, Math.min(mapWidth - 20, x)), y: Math.max(0, Math.min(mapHeight - 20, y)) };
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.8));

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getClinicIcon = (type: string) => {
    switch (type) {
      case 'Hospital':
        return '🏥';
      case 'Private Hospital':
        return '🏥';
      case 'Health Center':
        return '🏢';
      case 'Private Clinic':
        return '⚕️';
      default:
        return '📍';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Map Controls */}
        <div className="absolute top-2 right-2 z-20 flex flex-col space-y-1">
          <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-8 h-8 p-0"
            onClick={() => setShowRoutes(!showRoutes)}
            title={showRoutes ? "Hide routes" : "Show routes"}
          >
            <Navigation className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="w-8 h-8 p-0">
            <Locate className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Map Container */}
        <div 
          className="relative w-full h-48 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* Street Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            {/* Horizontal lines (streets) */}
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-0.5 bg-gray-400"
                style={{ top: `${(i + 1) * 8}%` }}
              />
            ))}
            {/* Vertical lines (streets) */}
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-0.5 bg-gray-400"
                style={{ left: `${(i + 1) * 6}%` }}
              />
            ))}
          </div>

          {/* Area Labels and Street Names */}
          <div className="absolute top-2 left-2 text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm">
            Puerto Princesa City Center
          </div>
          <div className="absolute top-8 right-4 text-xs text-gray-600 bg-white/80 px-1 py-0.5 rounded">
            Malvar St
          </div>
          <div className="absolute top-1/2 left-2 text-xs text-gray-600 bg-white/80 px-1 py-0.5 rounded">
            Rizal Ave
          </div>
          <div className="absolute bottom-1/3 right-6 text-xs text-gray-600 bg-white/80 px-1 py-0.5 rounded">
            San Pedro St
          </div>
          <div className="absolute top-1/4 left-1/3 text-xs text-gray-600 bg-white/80 px-1 py-0.5 rounded">
            National Highway
          </div>
          
          {/* Major Landmarks */}
          <div className="absolute top-1/2 right-1/4 text-xs text-gray-500 bg-yellow-100 px-1 py-0.5 rounded">
            City Hall
          </div>
          <div className="absolute bottom-1/4 left-1/4 text-xs text-gray-500 bg-green-100 px-1 py-0.5 rounded">
            Mendoza Park
          </div>

          {/* Route Lines */}
          {showRoutes && userLocation && selectedClinic && (
            <>
              {clinics
                .filter(clinic => selectedClinic === clinic.id)
                .map(clinic => {
                  const userPos = coordsToPixels(userLocation.lat, userLocation.lng);
                  const clinicPos = coordsToPixels(clinic.coordinates.lat, clinic.coordinates.lng);
                  const distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    clinic.coordinates.lat, clinic.coordinates.lng
                  );
                  
                  return (
                    <svg
                      key={`route-${clinic.id}`}
                      className="absolute inset-0 z-5 pointer-events-none"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#3b82f6"
                          />
                        </marker>
                      </defs>
                      <line
                        x1={userPos.x}
                        y1={userPos.y}
                        x2={clinicPos.x}
                        y2={clinicPos.y}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="8,4"
                        markerEnd="url(#arrowhead)"
                        opacity="0.8"
                      />
                      <text
                        x={(userPos.x + clinicPos.x) / 2}
                        y={(userPos.y + clinicPos.y) / 2 - 5}
                        fill="#3b82f6"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="bg-white px-1 rounded"
                      >
                        {distance.toFixed(1)} km
                      </text>
                    </svg>
                  );
                })
              }
            </>
          )}

          {/* User Location */}
          {userLocation && (
            <div
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${coordsToPixels(userLocation.lat, userLocation.lng).x}px`,
                top: `${coordsToPixels(userLocation.lat, userLocation.lng).y}px`
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600 bg-white px-1 rounded shadow">
                  You
                </div>
              </div>
            </div>
          )}

          {/* Clinic Markers */}
          {clinics.map((clinic) => {
            const position = coordsToPixels(clinic.coordinates.lat, clinic.coordinates.lng);
            const isSelected = selectedClinic === clinic.id;
            
            return (
              <div
                key={clinic.id}
                className={`absolute z-10 transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`
                }}
                onClick={() => onClinicSelect(clinic.id)}
              >
                <div className="relative">
                  {/* Clinic Pin */}
                  <div 
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm ${
                      isSelected 
                        ? 'bg-red-500 ring-2 ring-red-300' 
                        : clinic.type === 'Health Center' 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    <span className="text-white">
                      {getClinicIcon(clinic.type)}
                    </span>
                  </div>
                  
                  {/* Mobile Clinic Info Popup */}
                  {isSelected && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 bg-white rounded-lg shadow-xl border z-20 p-2.5">
                      <div className="text-xs">
                        <h4 className="font-medium text-gray-900 mb-1 leading-tight">{clinic.name}</h4>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <Badge 
                            variant={clinic.type === 'Health Center' ? 'default' : 'secondary'}
                            className="text-xs h-4 px-1.5"
                          >
                            {clinic.type}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                            <span className="text-xs">{clinic.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">{clinic.address}</p>
                        <p className="text-xs text-gray-600 mb-2">{clinic.distance} • {clinic.waitTime}</p>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" className="flex-1 text-xs h-6 px-2">
                            <Calendar className="w-2.5 h-2.5 mr-1" />
                            Book Appointment
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Phone className="w-2.5 h-2.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Navigation className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      </div>
                      {/* Arrow pointer */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Distance Circles (for reference) */}
          {userLocation && (
            <>
              <div
                className="absolute border border-blue-200 rounded-full opacity-30"
                style={{
                  left: `${coordsToPixels(userLocation.lat, userLocation.lng).x - 40}px`,
                  top: `${coordsToPixels(userLocation.lat, userLocation.lng).y - 40}px`,
                  width: '80px',
                  height: '80px'
                }}
              />
              <div
                className="absolute border border-blue-200 rounded-full opacity-20"
                style={{
                  left: `${coordsToPixels(userLocation.lat, userLocation.lng).x - 60}px`,
                  top: `${coordsToPixels(userLocation.lat, userLocation.lng).y - 60}px`,
                  width: '120px',
                  height: '120px'
                }}
              />
            </>
          )}
        </div>

        {/* Map Legend */}
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span>You</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Health Centers</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Hospitals</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Selected</span>
              </div>
              {showRoutes && (
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-0.5 bg-blue-500 border-dashed"></div>
                  <span>Route</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
              {selectedClinic && (
                <span>• Tap clinic for details</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}